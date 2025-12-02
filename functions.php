<?php
add_action("wp_enqueue_scripts", function () {
    if (function_exists("is_admin") && is_admin()) {
        return;
    }

    if (defined("WP_DEBUG") && WP_DEBUG) {
        // Dynamic Vite URL  detection
        $host = $_SERVER["HTTP_HOST"];
        if (strpos($host, ":") !== false) {
            $host = explode(":", $host)[0];
        }
        $vite_server = "http://{$host}:5173";

        echo '<script type="module" src="' . esc_url($vite_server . "/@vite/client") . '"></script>' . "\n";

        if (!bricks_is_builder_main()) {
            echo '<script type="module" src="' . esc_url($vite_server . "/resources/js/main.js") . '"></script>' . "\n";
        }
    } else {
        // Production Mode
        $dist_uri = get_stylesheet_directory_uri() . "/dist";
        $dist_dir = get_stylesheet_directory() . "/dist";

        if (!bricks_is_builder_main()) {
            if (file_exists("$dist_dir/style.css")) {
                wp_enqueue_style("bricks-child", "$dist_uri/style.css", ["bricks-frontend"], filemtime("$dist_dir/style.css"));
            }
            if (file_exists("$dist_dir/script.js")) {
                wp_enqueue_script("bricks-child", "$dist_uri/script.js", [], filemtime("$dist_dir/script.js"), true);
            }
        }
    }
});

// DYNAMIC CONTENT FILTER (Localhost -> IP)
if (defined("WP_DEBUG") && WP_DEBUG) {
    add_filter("the_content", function ($content) {
        $host = $_SERVER["HTTP_HOST"];
        // Only run if we are NOT on localhost (e.g. mobile testing)
        if (strpos($host, "localhost") === false) {
            $search = ["http://localhost", "https://localhost"];
            $replace = ["http://" . $host, "https://" . $host];
            $content = str_replace($search, $replace, $content);
        }
        return $content;
    });
}
