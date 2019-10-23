import path from 'path'

const dirObj = path.parse(__dirname)
export const getPathFromTestRoot = (filename:string) :string => dirObj.dir + path.sep + "files" + path.sep + filename