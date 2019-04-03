var callback = function(){
    // Handler when the DOM is fully loaded
    import { experimentInit } from 'experiment.mjs';
    experimentInit();
  };
  
  if (
      document.readyState === "complete" ||
      (document.readyState !== "loading" && !document.documentElement.doScroll)
  ) {
    callback();
  } else {
    document.addEventListener("DOMContentLoaded", callback);
  }