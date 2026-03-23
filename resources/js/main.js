import "../scss/main.scss";
import "./nav.js";
// Check if the KB Manager element exists on the page
if (document.querySelector('kb-manager')) {
  // Dynamically load the Vue code only when needed
  import('./kb-manager.js').then(() => {
    console.log('KB Manager loaded successfully!');
  });

}