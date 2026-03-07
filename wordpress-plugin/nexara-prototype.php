<?php
/**
 * Plugin Name:       NEXARA Prototype
 * Plugin URI:        https://example.com/nexara-prototype
 * Description:       Prototype WordPress plugin with admin page and shortcode.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            NEXARA
 * License:           GPL-2.0-or-later
 * Text Domain:       nexara-prototype
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'NEXARA_PROTOTYPE_VERSION', '1.0.0' );
define( 'NEXARA_PROTOTYPE_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'NEXARA_PROTOTYPE_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Activation: set default options.
 */
function nexara_prototype_activate() {
	add_option( 'nexara_prototype_message', 'Hello from NEXARA Prototype!' );
	add_option( 'nexara_prototype_version', NEXARA_PROTOTYPE_VERSION );
}

/**
 * Deactivation: optional cleanup (options kept for re-activation).
 */
function nexara_prototype_deactivate() {
	// No-op for prototype; optionally delete options here.
}

register_activation_hook( __FILE__, 'nexara_prototype_activate' );
register_deactivation_hook( __FILE__, 'nexara_prototype_deactivate' );

/**
 * Add admin menu and page.
 */
function nexara_prototype_admin_menu() {
	add_options_page(
		__( 'NEXARA Prototype', 'nexara-prototype' ),
		__( 'NEXARA Prototype', 'nexara-prototype' ),
		'manage_options',
		'nexara-prototype',
		'nexara_prototype_render_admin_page'
	);
}

/**
 * Render the plugin settings page.
 */
function nexara_prototype_render_admin_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$saved = false;
	if ( isset( $_POST['nexara_prototype_nonce'] ) &&
	     wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nexara_prototype_nonce'] ) ), 'nexara_prototype_save' ) ) {
		$message = isset( $_POST['nexara_message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['nexara_message'] ) ) : '';
		update_option( 'nexara_prototype_message', $message );
		$saved = true;
	}

	$message = get_option( 'nexara_prototype_message', 'Hello from NEXARA Prototype!' );
	?>
	<div class="wrap">
		<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
		<?php if ( $saved ) : ?>
			<div class="notice notice-success is-dismissible"><p><?php esc_html_e( 'Settings saved.', 'nexara-prototype' ); ?></p></div>
		<?php endif; ?>
		<form method="post" action="">
			<?php wp_nonce_field( 'nexara_prototype_save', 'nexara_prototype_nonce' ); ?>
			<table class="form-table">
				<tr>
					<th scope="row"><label for="nexara_message"><?php esc_html_e( 'Message', 'nexara-prototype' ); ?></label></th>
					<td>
						<textarea name="nexara_message" id="nexara_message" rows="3" class="large-text"><?php echo esc_textarea( $message ); ?></textarea>
						<p class="description"><?php esc_html_e( 'This text is shown when you use the [nexara_hello] shortcode.', 'nexara-prototype' ); ?></p>
					</td>
				</tr>
			</table>
			<?php submit_button( __( 'Save settings', 'nexara-prototype' ) ); ?>
		</form>
	</div>
	<?php
}

/**
 * Shortcode [nexara_hello]: output the configured message.
 *
 * @return string
 */
function nexara_prototype_shortcode_hello() {
	$message = get_option( 'nexara_prototype_message', 'Hello from NEXARA Prototype!' );
	return '<p class="nexara-prototype-message">' . esc_html( $message ) . '</p>';
}

add_action( 'admin_menu', 'nexara_prototype_admin_menu' );
add_shortcode( 'nexara_hello', 'nexara_prototype_shortcode_hello' );
