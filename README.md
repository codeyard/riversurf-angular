# riversurf-angular

Angular frontend for RiverSurf.app.

*"Plan, keep track and stay up to date at river surf events."*

Team:

* Alain Messerli @messa4
* Igor Stojanovic @stoji2
* Marius Stalder @stalm12
* Raphael Gerber @gerbr19


![RiverSurf.app Result View](src/assets/images/riversurf-app.png)

## Live Demo

You can visit the application at [https://test.riversurf.app](https://test.riversurf.app). Alternatively you can scan the following QR Code:

![QR Code](src/assets/images/qr-code.png)


## Administrator Access

[Login](https://test.riversurf.app/login) with Username: `fritz32`, Password: `123456789`.


## Installation

Clone the repository and install dependencies:
```
git clone https://gitlab.ti.bfh.ch/aligmara/riversurf-angular.git
cd riversurf-angular
npm ci
```

Run the app in development mode with `npm start` or `ng serve` and open [http://localhost:4200](http://localhost:4200) in your browser.

## Build

Run `npm run build` or `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.


## Progressive Web App (PWA)

To test the PWA locally, the following steps are required:

* **Build** the project (see above)
* Install an HTTP-Server, e.g. by running `npm install http-server -g`
* Serve the build with `http-server -p 9000`
* Navigate to [http://localhost:9000](http://localhost:9000)

Please note that `Port 9000` is only a suggestion and can be customized as desired.


## Documentation

The detailed documentation can be found in our [Wiki](https://gitlab.ti.bfh.ch/aligmara/riversurf-angular/-/wikis/home).
