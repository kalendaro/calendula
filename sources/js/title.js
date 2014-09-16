function Title() {
    this._title = {};
}

extend(Title.prototype, {
    init: function(data) {
        this.set(data.title);
    },
    get: function(date) {
        return this._title[date];
    },
    set: function(data) {
        var tt = this._title;

        function save(el) {
            tt[el.date] = {text: el.text, color: el.color};
        };

        if(!data) {
            return;
        }
        
        if(isArray(data)) {
            data.forEach(function(el) {
                save(el);
            });
        } else {
            save(data);
        }
    },
    remove: function(date) {
        delete this._title[date];
    },
    removeAll: function() {
        this._title = {};
    },
    destroy: function() {
        delete this._title;
    }
});
