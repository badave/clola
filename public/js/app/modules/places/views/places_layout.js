PlacesLayout = Backbone.Marionette.Layout.extend({
	template_path: "places/layout",
	className: "places-view",
	params: {},
	regions: {
		"cities": ".cities",
		"areas": ".areas",
		"categories": ".categories",
		"subcategories": ".subcategories",
		"places": ".places",
		"place": ".place"
	},
	events: {
		"render": "onRender"
	},
	onRender: function() {
		this.renderCities();
		this.bindEvents();
	},
	bindEvents: function() {
		var that = this;
		_.bindAll(this, "selectArea", "selectCategory", "selectSubcategory");
		App.PlacesController.listenTo(App.PlacesController, "city:selected", that.selectArea);
		App.PlacesController.listenTo(App.PlacesController, "area:selected", that.selectCategory);
		App.PlacesController.listenTo(App.PlacesController, "category:selected", that.selectSubcategory);

	},
	renderCities: function() {
		var cities = this.collection.cities();

		this.citiesListView = new CitiesListView({
			array: this.collection.cities()
		});

		// this.cities is the region
		this.cities.show(this.citiesListView);

		// Since we're only really doing new york right now...
		if(cities.length === 1) {
			this.selectArea(cities[0]);
			this.citiesListView.list[0].select();
		}
	},

	selectArea: function(city) {
		this.params.city = city;

		delete this.params.area;
		delete this.params.category;
		delete this.params.subcategory;

		if(this.categoriesListView) {
			this.categoriesListView.$el.hide();
		}

		if(this.subcategoriesListView) {
			this.subcategoriesListView.$el.hide();
		}

		this.renderAreasList();
	},

	renderAreasList: function() {
		var areas = this.uniques("area");

		this.areasListView = new AreasListView( {
			array: areas
		});

		this.areas.show(this.areasListView);
	},

	selectCategory: function(area) {
		this.params.area = area;

		delete this.params.category;
		delete this.params.subcategory;

		if(this.subcategoriesListView) {
			this.subcategoriesListView.$el.hide();
		}

		this.renderCategoriesList();
	},

	renderCategoriesList: function() {
		var categories = this.uniques("category");

		this.categoriesListView = new CategoriesListView({
			array: categories
		});

		this.categories.show(this.categoriesListView);
	},

	selectSubcategory: function(category) {
		this.params.category = category;
		this.renderSubcategoriesList();
	},

	renderSubcategoriesList: function() {
		var subcategories = this.uniques("subcategory");

		this.subcategoriesListView = new SubcategoriesListView({
			array: subcategories
		});

		this.subcategories.show(this.subcategoriesListView);
	},


	uniques: function(key) {
		return _.sortBy(_.uniq(_.map(this.collection.where(this.params), function(el) {
			return el.get(key);
		})), function(el) { return el; });
	}
});