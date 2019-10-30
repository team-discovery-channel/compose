import * as shell from "shelljs";

shell.cp( "-R", [ "src/views" ] , "dist/src" );
// shell.cp( "-R", [ "src/scripts" ] , "dist/src" );
shell.cp( "-R", [ "node_modules/zip-js/WebContent" ] , "dist/src" );
