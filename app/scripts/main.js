require.config({
	paths: {
		jquery: 'libs/jquery',
		jqueryMobile: 'libs/jquery.mobile-1.4.5.min',
        app: 'app'
	},
  shim: {
	"libs/jquery.mobile-1.4.5.min" : { deps: ["jquery"], exports: 'jquery' },
    "app" : { deps: ["jquery"], exports: 'jquery' }
  }
});


requirejs(['jquery', 'jqueryMobile', 'app']);
