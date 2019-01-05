import DomEvent from './dom-event';
import Template from './template';
import Timeout from './timeout';
import Title from './title';
import Tooltip from './tooltip';

import Calendula from '../calendula';

let extensions = [];

function getExtensionName(ext) {
    return ext.name[0].toLowerCase() + ext.name.substr(1);
}

Calendula.extend(Calendula.prototype, {
    _initExtensions() {
        extensions.forEach((Extension) => {
            const obj = new Extension(this.params, this._dom);
            obj.parent = this;
            this[getExtensionName(Extension)] = obj;
        });
    },
    _destroyExtensions() {
        extensions.forEach((ext) => {
            const name = getExtensionName(ext);
            this[name].destroy && this[name].destroy();
            delete this[name];
        }, this);
    }
});

Calendula.addExtension = (klass) => {
    if (Array.isArray(klass)) {
        extensions = extensions.concat(klass);
    } else {
        extensions.push(klass);
    }
};

Calendula.addExtension([
    DomEvent,
    Template,
    Timeout,
    Title,
    Tooltip
]);
