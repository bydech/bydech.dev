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

// This code adds a custom class to the header. Otherwise we need an extra div (section) inside the header template. With this code we don't
add_filter("bricks/header/attributes", function ($attributes) {
    if (isset($attributes["class"]) && is_array($attributes["class"])) {
        $attributes["class"][] = "header";
    } else {
        $attributes["class"] = ["header"];
    }

    return $attributes;
});

/**
 * Retrieves the 'snippet-category' terms for the current post.
 * Returns an array of WP_Term objects for Bricks to loop over.
 */
function get_current_snippet_categories()
{
    // 1. Get the ID of the snippet we are currently looking at
    $post_id = get_the_ID();

    // 2. Ask WordPress for all 'snippet-category' terms attached to this post
    $terms = get_the_terms($post_id, "snippet-category");

    // 3. Safety check: If there are no terms or an error, return an empty array so the loop doesn't crash
    if (!is_array($terms) || is_wp_error($terms)) {
        return [];
    }

    // (Optional) You could run a custom PHP sort or filter on the $terms array right here!

    // 4. Return the array of terms back to Bricks
    return $terms;
}
