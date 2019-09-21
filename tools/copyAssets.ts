import * as shell from "shelljs";

shell.cp( "-R", [ "src/views" ] , "dist/src" );
shell.cp( "-R", [ "src/css" ] , "dist/src" );