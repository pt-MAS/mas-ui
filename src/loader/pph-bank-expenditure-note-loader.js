import { Container } from 'aurelia-dependency-injection';
import { Config } from "aurelia-api";

const resource = 'expedition/pph-bank-expenditure-notes';

module.exports = function (keyword, filter) {
    var config = Container.instance.get(Config);
    var endpoint = config.getEndpoint("purchasing-azure");

    return endpoint.find(resource, { keyword: keyword, filter: JSON.stringify(filter) })
        .then(results => {
            return results.data
        });
}
