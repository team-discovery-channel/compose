import {compose} from '../../src/api/index';
import { TIMEOUT } from 'dns';
import { resolve } from 'url';

test("Expected return from compose must be valid json", () => {

    const validJson = () => {
        compose({"hello_world.js":["Line 1", "Line 2","line 3","Line 4"]})
    };

    expect(validJson)
        .not
        .toThrow();
});
