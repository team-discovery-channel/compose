import {compose} from '../src/api/index';
import { TIMEOUT } from 'dns';
import { resolve } from 'url';


/*
************* expect (i.e. assertions) *****************
*/

test("Expected return from compose must be valid json", () => {

    const validJson = () => {
        compose({"hello_world.js":["Line 1", "Line 2","line 3","Line 4"]})
    };

    expect(validJson)
        .not
        .toThrow();
});

test('matchers example', () => {
    const n = null;
    expect(n).toBeNull();
    expect(n).toBeDefined();
    expect(n).not.toBeUndefined();
    expect(n).not.toBeTruthy();
    expect(n).toBeFalsy();

    expect(2+2).toBe(4);
    expect(2.0+2.0).toEqual(4.0)
    expect("").not.toBeTruthy()

    expect("hello_world").toMatch(/l{2}/)

    const team:string[] = [
        "Rob",
        "Travis",
        "Rin",
        "Jon"
    ]

    expect(team).toContain("Jon")

    function throwable(){
        throw("Ben is not in team");
    }
    expect(throwable).toThrow(/Ben/);

});

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
async function simulateRemote(ms :number):Promise<string>{
    return new Promise<string>( async (resolve, reject) =>{
        await delay(ms);
        resolve("test")
    })
}

test('simulate remote', async () => {
    console.log("...timeout...")
    await expect(simulateRemote(3000)).resolves.toBe('test');
    console.log("3 seconds elapse")
  });
  test('Cant do more than 5 seconds in single test, config opt', async (done) => {
    console.log("...timeout...")
    await expect(simulateRemote(3000)).resolves.toBe('test');
    console.log("3 seconds elapse")
    done()
  });

describe("grouping tests", () => {
    let jon = {"name": "Jon",
               "isAlive": () => {return true}}
    
    test("my name is",() => {
        expect(jon.name).toEqual("Jon");
    })
    test("Jon should be alive", () => {
        expect(jon.isAlive()).toBe(true);
    })
})

/*
************* Mocking Functions *****************
*/
const mockCallback = jest.fn((x:number) => 42 + x)
var num :number[] = [0, 1, 2]
num.forEach(mockCallback)

describe("testing mock functions", () => {
    test("the answer to the universe", () => {
        expect(mockCallback.mock.results[0].value).toBe(42);
    })
    test("not the answer to the universe", () => {
        expect(mockCallback.mock.results[1].value).not.toBe(42);
    })
    test("not the answer to the universe", () => {
        expect(mockCallback.mock.results[2].value).not.toBe(42);
    })

    const myMock = jest.fn()
    const a = new myMock();
    const b = {"name":"Jon"}

    const bound = myMock.bind(b);
    bound()

    console.log(myMock.mock.instances);


    const mockingInput = jest.fn().mockName("input mock")
    mockingInput.mockReturnValueOnce("directory1")
                .mockReturnValueOnce("directory2")
                .mockReturnValueOnce("directory3")
                .mockReturnValueOnce("directory4")
    mockingInput()
    mockingInput()
    mockingInput()
    mockingInput()
    test("input", () => {
        expect(mockingInput.mock.results[0].value).toEqual("directory1")
        expect(mockingInput.mock.results[3].value).toEqual("directory4")
    })
    
})
