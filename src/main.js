// we want font-awesome to load as soon as possible to show the fa-spinner
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
import '../styles/styles.css';
import '../styles/styles.components.css';
import '../styles/styles.login.css';
import '../styles/styles.theme.css';
import '../styles/dashboard.css';
import 'bootstrap';
import authConfig from "../auth-config";

// comment out if you don't want a Promise polyfill (remove also from webpack.common.js)
import * as Bluebird from 'bluebird';
Bluebird.config({ warnings: false });

export async function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('au-components')
    .feature('components')
    .feature('converters')

    .plugin("aurelia-api", config => {
      var offset = new Date().getTimezoneOffset() / 60 * -1;
      var defaultConfig = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-timezone-offset': offset
        }
      }

      //var core = "https://com-danliris-service-core-dev.azurewebsites.net/v1/";
      var core = "https://com-mas-service-core-dev.azurewebsites.net/v1/";
      //var auth = "https://mas-auth-api.azurewebsites.net/v1/";
      var auth = "https://mas-auth-api-dev.azurewebsites.net/v1/";
      //var production = "https://dl-production-webapi-dev.azurewebsites.net/v1/";
      //var productionAzure = "https://com-danliris-service-finishing-printing-dev.azurewebsites.net/v1/";
      //var purchasing = "https://dl-purchasing-webapi-dev.azurewebsites-dev.net/v1/";
      //var purchasingAzure = "https://com-danliris-service-purchasing-dev.azurewebsites.net/v1/";
      //var garmentPurchasing = "https://dl-purchasing-garment-webapi-dev.azurewebsites.net/v1/";
      //var inventory = "https://dl-inventory-webapi-dev.azurewebsites.net/v1/";
      //var inventoryAzure = "https://com-danliris-service-inventory-dev.azurewebsites.net/v1/";
      var inventoryAzure = "https://com-mas-service-inventory-dev.azurewebsites.net/v1/";
     //var garmentMasterPlan = "https://dl-garment-master-plan-webapi-dev.azurewebsites.net/v1/";
      //var spMasterPlan = "https://dl-sp-master-plan-webapi-dev.mybluemix.net/v1/";
      //var spinning = "https://com-danliris-service-spinning-dev.azurewebsites.net/";
      //var intPurchasing = "https://com-danliris-service-internal-transfer-dev.azurewebsites.net/v1/";
      //var customsReport = "https://com-danliris-service-support-dev.azurewebsites.net/v1/";
      //var merchandiser = "https://com-danliris-service-md.azurewebsites-dev.net/v1/";
      //const dealTracking = 'https://com-danliris-service-deal-tracking-dev.azurewebsites.net/v1/';
      //const sales = "https://com-danliris-service-sales-dev.azurewebsites.net/v1/";
      //const sales = "http://localhost:59269/v1/";
      const sales = "https://com-mas-sales-dev.azurewebsites.net/v1/";
      //var weaving = "https://com-danliris-service-weaving-dev.azurewebsites.net/";
      //var finance = "https://com-danliris-service-finance-accounting-dev.azurewebsites.net/v1/";
      //var garmentProduction = "https://com-danliris-service-garment-dev.azurewebsites.net/";

      config.registerEndpoint('auth', auth);
      config.registerEndpoint('core', core);
     // config.registerEndpoint('production', production, defaultConfig);
      //config.registerEndpoint('production-azure', productionAzure, defaultConfig);
      //config.registerEndpoint('purchasing', purchasing, defaultConfig);
      //config.registerEndpoint('purchasing-azure', purchasingAzure, defaultConfig);
      //config.registerEndpoint('garment-purchasing', garmentPurchasing, defaultConfig);
      //config.registerEndpoint('inventory', inventory, defaultConfig);
      config.registerEndpoint('inventory-azure', inventoryAzure, defaultConfig);
      //config.registerEndpoint('garment-master-plan', garmentMasterPlan, defaultConfig);
      //config.registerEndpoint('spinning', spinning, defaultConfig);
      //config.registerEndpoint('int-purchasing', intPurchasing, defaultConfig);
      //config.registerEndpoint('customs-report', customsReport, defaultConfig);
      //config.registerEndpoint('merchandiser', merchandiser, defaultConfig);
      //config.registerEndpoint('deal-tracking', dealTracking, defaultConfig);
      config.registerEndpoint('sales', sales, defaultConfig);
      //config.registerEndpoint('finance', finance, defaultConfig);
      //config.registerEndpoint('garment-production', garmentProduction, defaultConfig);
    })
    .plugin("aurelia-authentication", baseConfig => {
      baseConfig.configure(authConfig);

      if (baseConfig.client && baseConfig.client.client) {
        var offset = new Date().getTimezoneOffset() / 60 * -1;
        baseConfig.client.client.withDefaults({
          headers: {
            'x-timezone-offset': offset
          }
        })
      }
    })
    .plugin('aurelia-dialog', config => {
      config.useDefaults();
      config.settings.lock = true;
      config.settings.centerHorizontalOnly = false;
      config.settings.startingZIndex = 5;
    })
    .plugin('aurelia-dragula')
    .plugin('aurelia-bootstrap')
    .developmentLogging();

  // Uncomment the line below to enable animation.
  // aurelia.use.plugin('aurelia-animator-css');
  // if the css animator is enabled, add swap-order="after" to all router-view elements

  // Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  // aurelia.use.plugin('aurelia-html-import-template-loader')

  await aurelia.start();
  aurelia.setRoot('app');

  // if you would like your website to work offline (Service Worker), 
  // install and enable the @easy-webpack/config-offline package in webpack.config.js and uncomment the following code:
  /*
  const offline = await System.import('offline-plugin/runtime');
  offline.install();
  */
}
