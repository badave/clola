PlacesLayout = Backbone.Marionette.Layout.extend({
	template_path: "places/layout",
	className: "places-view",
	params: {},
	regions: {
		"cities": ".cities",
		"areas": ".areas",
		"categories": ".categories",
		"subcategories": ".subcategories",
		"places_list": ".places-list",
		"place": ".selected-place",
		"sidepane": ".sidepane.left"
	},

	events: {
		"keyup #places-search": "searchPlaces",
		"click #add-place": "newPlace",
		"click .pane-overlay": "hideSidepane"
	},

	onRender: function() {
		this.renderCities();
		this.bindEvents();
	},

	bindEvents: function() {
		var that = this;
		_.bindAll(this, "selectArea", 
			"selectCategory", 
			"selectSubcategory", 
			"showPlaces", 
			"selectPlace",
			"editPlace",
			"hideSidepane",
			"updateViews");

		App.vent.on("city:selected", this.selectArea);
		App.vent.on("area:selected", this.selectCategory);
		App.vent.on("category:selected", this.selectSubcategory);
		App.vent.on("subcategory:selected", this.showPlaces);
		App.vent.on("place:selected", this.selectPlace);
		App.vent.on("place:edit", this.editPlace);
		App.vent.on("hide:sidepane-left", this.hideSidepane);

		App.vent.on("place:created", function(place) {
			that.collection.add(place);
		})

		this.collection.on("change", this.updateViews);
		this.collection.on("add", this.updateViews);

	},

	updateViews: function() {
		// Refactor to use list view instead of this by passing collection to each view
		if(this.citiesListView) {
			this.citiesListView.onRender();
		}

		if(this.areasListView) {
			this.areasListView.onRender();
		}

		if(this.categoriesListView) {
			this.categoriesListView.onRender();
		}

		if(this.subcategoriesListView) {
			this.categoriesListView.onRender();
		}

		if(this.placesListView) {
			this.placesListView.onRender();
		}

		if(this.placeView) {
			this.placeView.render();
		}
	},

	renderCities: function() {
		var cities = this.collection.pluckUnique("city");

		this.citiesListView = new CitiesListView({
			array: cities
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

		this.hideSubpane();
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

		this.hideSubpane();
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

		delete this.params.subcategory;

		this.renderSubcategoriesList();

		this.hideSubpane();
	},

	renderSubcategoriesList: function() {
		var subcategories = this.uniques("subcategory");

		this.subcategoriesListView = new SubcategoriesListView({
			array: subcategories
		});

		this.subcategories.show(this.subcategoriesListView);
	},

	showPlaces: function(subcategory) {
		this.params.subcategory = subcategory;

		var places = this.collection.where(this.params);

		this.placesListView = new PlacesListView({
			array: places
		});

		this.places_list.show(this.placesListView);

		this.showSubpane();

		if(places.length) {
			this.selectPlace(places[0]);

			this.placesListView.list[0].select();
		}
	},

	selectPlace: function(place) {
		this.placeView = new PlaceView({
			model: place
		});

		console.log(place.attributes);

		this.place.show(this.placeView);
	},

	searchPlaces: function() {
		var search = this.$el.find("#places-search").val();

		if(search && search.length > 2) {
			var places = this.collection.search(search, {
				"excludes": ["category", "subcategory", "area", "city"]
			});

			this.placesListView = new PlacesListView({
				array: places
			});

			this.places_list.show(this.placesListView);

			this.fullSubpane();

			if(places.length) {
				this.selectPlace(places[0]);
				
				this.placesListView.list[0].select();
			}
		} else {
			// else if we aren't displaying something...
			if(!this.params.subcategory) {
				this.hideSubpane();
			} else {
				this.showPlaces(this.params.subcategory);

				this.hideSubpane();
				this.showSubpane();
			}
		}
	},

	newPlace: function() {
		var place = new Place();
		this.editPlace(place);
	},

	editPlace: function(place) {
		var cities = this.collection.pluckUnique("city");
		var areas = this.collection.pluckUnique("area");
		var categories = this.collection.pluckUnique("category");
		var subcategories = this.collection.pluckUnique("subcategory");

		this.placeEditView = new PlaceEditView({
			model: place,
			cities: cities,
			areas: areas,
			categories: categories,
			subcategories: subcategories
		});

		this.sidepane.show(this.placeEditView);
		this.showSidepane();
	},

	showSubpane: function() {
		this.$el.find(".pane").addClass("shrink");
		this.$el.find(".subpane").addClass("expand");
	},

	fullSubpane: function() {
		this.$el.find(".pane").addClass("shrinkFull");
		this.$el.find(".subpane").addClass("full");
	},

	hideSubpane: function() {
		this.$el.find(".pane").removeClass("shrink");
		this.$el.find(".subpane").removeClass("expand");


		this.$el.find(".pane").removeClass("shrinkFull");
		this.$el.find(".subpane").removeClass("full");
	},

	showSidepane: function() {
		this.$el.find(".sidepane").addClass("expand");
		this.$el.find(".pane-overlay").show();
		var that = this;
		setTimeout(function() { that.$el.find(".sidepane form").fadeIn(); }, 300)
	},

	hideSidepane: function() {
		var that = this;
		this.$el.find(".sidepane form").fadeOut();
		this.$el.find(".pane-overlay").hide();
		setTimeout(function() { 
			that.$el.find(".sidepane").removeClass("expand"); 
		}, 300);
	},

	uniques: function(key) {
		return _.sortBy(_.uniq(_.map(this.collection.where(this.params), function(el) {
			return el.get(key);
		})), function(el) { return el; });
	}
});