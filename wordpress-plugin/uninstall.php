<?php
/**
 * Uninstall NEXARA Prototype – remove options when plugin is deleted.
 *
 * Runs only when the plugin is deleted from Plugins → Delete, not on deactivate.
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

delete_option( 'nexara_prototype_message' );
delete_option( 'nexara_prototype_version' );
