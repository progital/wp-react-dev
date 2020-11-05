<?php

/**
 * Plugin Name:       WP + React
 * Plugin URI:
 * Description:       Practical React development for WordPress.
 * Version:           0.0.1
 * Author:            Progital
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
  // name of the meta field containing plugin's options
  const META_OPTIONS = 'wpreactdev_app_opts';
  // name of the meta field that enabled the plugin for a particular post
  const META_ENABLED = 'wpreactdev_app_enabled';
  // enabled for this post type
  const POST_TYPE = 'page';
  // input name - admin options
  const INPUT_NAME_ADMIN_OPTIONS = 'wpreactdev-input-admin-options';
  // input name - frontend options
  const INPUT_NAME_USER_OPTIONS = 'wpreactdev-input-user-options';
  // plugin version
  const VERSION = '0.0.1';

  private static $instance;

  // we don't want additional copies of this class created
  private function __construct()
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

    return (bool)get_post_meta(self::META_ENABLED, $post->ID, true);
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

  // retrieves app settings for a post (frontend and backend)
  public function getPostOptions()
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

  // injects global variables in js (frontend and backend)
  protected function addGlobalVars()
  {
    $vars = json_encode([
      'settings' => $this->getPostOptions(),
    ]);

    // a convoluted way of adding inline script via WordPress API
    wp_register_script('wpreactdev-vars', '', [], '', true);
    wp_enqueue_script('wpreactdev-vars');
    wp_add_inline_script(
      'wpreactdev-vars',
      sprintf('window.wpreactdevOptions = %s;', $vars)
    );
  }

  protected function addHooks()
  {
    add_action('wp_enqueue_scripts', [$this, 'addFrontendScripts'], 1000);
    add_action('add_meta_boxes', [$this, 'addAdminMetaBox']);
    add_action('admin_enqueue_scripts', [$this, 'addAdminScripts'], 1000);
    add_action(sprintf('save_post_%s', self::POST_TYPE), [$this, 'saveSettings']);
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
