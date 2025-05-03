import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));


  window.onload = function () {
    const logo = document.getElementById("logo");
    const content = document.getElementById("content");
  
    setTimeout(function () {
      if (content) {
        content.classList.add("visible"); // Rendre le contenu visible seulement si l'élément existe
      }
    }, 3000);
  };
  
