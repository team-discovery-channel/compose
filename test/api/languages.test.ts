import {languages, languageFactory} from "../../src/api/languages"

test("language list exists", ()=>{
  expect(languages).toBeDefined()
})

test("languageFactory javascript test", ()=>{
  expect(languageFactory("javascript").getName()).toEqual("javascript")
})

