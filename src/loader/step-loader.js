import { Container } from 'aurelia-dependency-injection';
import { Config } from "aurelia-api";

const resource = 'master/steps';

module.exports = function(keyword, filter, select) {

    var config = Container.instance.get(Config);
    var endpoint = config.getEndpoint("core");

    return endpoint.find(resource, { keyword: keyword, filter: JSON.stringify(filter), select: select })
        .then(results => {
            return results.data.map(step => {
                step.toString = function () {
                    return `${this.process}`;
                }
                return step;
            });
        });
}
