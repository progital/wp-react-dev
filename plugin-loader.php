<?php

/**
 * Plugin Name:       WP + React
 * Plugin URI:        https://github.com/progital/wp-react-dev
 * Description:       Practical React development for WordPress.
 * Version:           0.0.1
 * Author:            Progital
 * Author URI:        https://github.com/progital
 * Requires at least: 5.0
 * Requires PHP:      7.0
 *
 */

if (!defined('WPINC')) {
    exit;
}

class WPDevReactFeature
{
  // id of the container element where react app is rendered into
  const REACT_APP_ROOT = 'wp-react-dev-app';

  // name of the meta field containing user selection
  const META_USER_SELECTION = 'wpreactdev_user_selection';

  // name of the meta field that enabled the plugin for a particular post
  const META_OPTIONS = 'wpreactdev_app_opts';

  // name of the meta field that enabled the plugin for a particular post
  const META_ENABLED = 'wpreactdev_app_enabled';

  // enabled for this post type
  const POST_TYPE = 'page';

  // input name - admin options
  const INPUT_NAME_ADMIN_OPTIONS = 'wpreactdev-input-admin-options';

  // input names - frontend options
  const INPUT_NAME_USER_OPTIONS = 'wpreactdev-input-user-options';
  const INPUT_NAME_POST_ID = 'wpreactdev-input-post-id';

  // plugin version
  const VERSION = '0.0.1';

  protected static $instance;

  // we don't want additional copies of this class created
  protected function __construct()
  {
    $this->addHooks();
  }

  // starts the plugin
  public static function init()
  {
    return self::instance();
  }

  // this can be used as a global function that returns an instance of this class
  public static function instance()
  {
    if (!(self::$instance instanceof self)) {
      self::$instance = new self;
    }

    return self::$instance;
  }

  public static function isEnabled()
  {
    global $post;
    if (!is_object($post)) {
      return false;
    }

    return (bool)get_post_meta($post->ID, self::META_ENABLED, true);
  }

  // adds a placeholder for the admin app
  public function addAdminMetaBox()
  {
    // only on pages
    add_meta_box(
      'wpreactdev-app-admin-box',
      'WP React Dev',
      function() {
        ?>
          <div id="<?= self::REACT_APP_ROOT ?>">
              Loading the app, please hold on...
          </div>
        <?php
      },
      self::POST_TYPE,
      'normal',
      'high'
    );
  }

  // shortcode
  public function renderFrontend($atts)
  {
    if (!self::isEnabled()) {
      return '';
    }

    ob_start()
    ?>
      <div id="<?= self::REACT_APP_ROOT ?>">
        Loading the app, please hold on...
      </div>
    <?php

    return ob_get_clean();
  }

  // enqueues frontend js
  public function addFrontendScripts()
  {
    if (!self::isEnabled()) {
      return;
    }

    $this->addGlobalVars();

    wp_enqueue_script(
      'wpreactdev-frontend',
      self::baseUrl() . 'assets/js/wpreactdev.frontend.js',
      [],
      self::VERSION,
      true
    );
  }

  // enqueues admin app js
  public function addAdminScripts()
  {
    $screen = get_current_screen();
    if (!is_object($screen) || !($screen->post_type === self::POST_TYPE)) {
        return;
    }

    $this->addGlobalVars();

    wp_enqueue_script(
      'wpreactdev-admin',
      self::baseUrl() . 'assets/js/wpreactdev.backend.js',
      ['wp-media-utils'],
      self::VERSION,
      true
    );
  }

  // saves app settings in post meta
  // ATTENTION! This code is not exactly production ready
  // it lacks any authentication, for one thing
  public function saveSettings($post_id)
  {
    $json = $_POST[self::INPUT_NAME_ADMIN_OPTIONS] ?? null;
    if (empty($json)) {
      return;
    }

    $json = wp_unslash($json);
    $decoded = json_decode($json, true);
    // sanity check
    if (!is_array($decoded)) {
      return;
    }

    update_post_meta($post_id, self::META_ENABLED, $decoded['enabled'] ?? false);
    update_post_meta($post_id, self::META_OPTIONS, $json);
  }

  // saves user settings in post meta
  // ATTENTION! This code is not exactly production ready
  // it lacks any authentication or validation, for one thing
  // and you don't want anyone saving anything in your post meta
  public function saveUserSettings()
  {
    // we want this function to run only on frontend
    if (is_admin()) {
      return;
    }

    $json = $_POST[self::INPUT_NAME_USER_OPTIONS] ?? null;
    $post_id = $_POST[self::INPUT_NAME_POST_ID] ?? null;
    if (empty($json) || empty($post_id)) {
      return;
    }

    $json = wp_unslash($json);
    $decoded = json_decode($json, true);
    // sanity check
    if (!is_array($decoded)) {
      return;
    }

    update_post_meta($post_id, self::META_USER_SELECTION, $json);
    // exit because this is expected to be an AJAX request
    exit;
  }

  // retrieves app settings for a post (frontend and backend)
  protected function getAdminOptions()
  {
    global $post;
    if (!is_object($post) || $post->post_type !== self::POST_TYPE) {
      return false;
    }

    $default = [ 'enabled' => false ];
    $opts = get_post_meta($post->ID, self::META_OPTIONS, true);
    if (!$opts) {
      return $default;
    }

    return json_decode($opts, true);
  }

  // retrieves app settings for a post (frontend and backend)
  protected function getUserSettings()
  {
    global $post;
    if (!is_object($post) || $post->post_type !== self::POST_TYPE) {
      return false;
    }

    $opts = get_post_meta($post->ID, self::META_USER_SELECTION, true);

    return $opts ? json_decode($opts, true) : null;
  }

  // injects global variables in js (frontend and backend)
  protected function addGlobalVars()
  {
    global $post;

    $vars = [
      'settings' => $this->getAdminOptions(),
      'postId' => is_object($post) ? $post->ID : 0,
    ];

    $selection = $this->getUserSettings();

    if ($selection) {
      $vars['selection'] = $selection;
    }

    $json = json_encode($vars);

    // a convoluted way of adding inline script via WordPress API
    wp_register_script('wpreactdev-vars', '', [], '', true);
    wp_enqueue_script('wpreactdev-vars');
    wp_add_inline_script(
      'wpreactdev-vars',
      sprintf('window.wpreactdevOptions = %s;', $json)
    );
  }

  protected function addHooks()
  {
    add_action('wp_enqueue_scripts', [$this, 'addFrontendScripts'], 1000);
    add_action('add_meta_boxes', [$this, 'addAdminMetaBox']);
    add_action('admin_enqueue_scripts', [$this, 'addAdminScripts'], 1000);
    add_action(sprintf('save_post_%s', self::POST_TYPE), [$this, 'saveSettings']);
    add_action('wp_loaded', [$this, 'saveUserSettings']);
    add_shortcode('wpd-frontend', [$this, 'renderFrontend']);
  }

  // Get the URL directory path (with trailing slash)
  protected static function baseUrl()
  {
    return plugin_dir_url(__FILE__);
  }
}

// runs the plugin
add_action('plugins_loaded', function() {
  WPDevReactFeature::init();
}, 200);
