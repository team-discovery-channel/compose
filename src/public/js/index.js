//zip.useWebWorkers = false
zip.workerScriptsPath = 'js/WebContent/';
function processZipFile(blob){
    // use a BlobReader to read the zip from a Blob object
    zip.createReader(new zip.Data64URIReader(blob), function(reader) {

    // get all entries from the zip
    reader.getEntries(function(entries) {
        if (entries.length) {
            var fileDirectory = entries.sort(function(a,b){
                var aDirCount = a.filename .split('/').length;
                var bDirCount = b.filename .split('/').length;
                if (aDirCount < bDirCount) {
                    return -1;
                }
                if (aDirCount > bDirCount) {
                    return 1;
                }
                return 0;
            })
            .reverse()
            .reduce(function(acc,entry){
                if (entry.directory ) {
                    var dirArray = entry.filename.split('/');
                    var dirName = dirArray[dirArray.length - 2];
                    var defaultToOpen = '';
                    if (dirArray.length === 2) {
                    defaultToOpen = 'data-jstree=\'{"opened":true}\'';
                    }
                    acc = `<li ${defaultToOpen}>${dirName}<ul>` + acc + '</ul></li>';
                } else {
                    var entryName = entry.filename.split('/').pop()
                    acc += `<li id="${
                        entryName
                    }" data-jstree='{"icon":"material-icons tiny"}'><a href="#" onclick="setEntry(this, '${entry.filename}')">${entryName}</a></li>`;
                }
                return acc;

            },"")

            $("#directoryContainer").find("ul").html(fileDirectory)
            $("#directoryContainer").find("div").css("display","block")
            initJsTree()

            $("button[name='action']").html("Download<i class=\"material-icons right\"></i>")

            $("button[name='action']").off("click")
            $("button[name='action']").on("click",submitHiddenForm)

            $(".progress").css("display","none")
            $(".outform").css("display","block")


        }
    });
    }, function(error) {
        console.log("Zipjs was unable to process the file")
    });
}

$( document ).ready(function() {
    $("input[name='zip']").on("change",function(){
        var filename = $(this).val()
        $("#filename").val(filename.split("\\").pop().split("/").pop())

    })

    $("button[name='action']").on("click", function(){

        var file = $("input[name='zip']")[0].files[0]

        if (file) {
            $(".progress").css("display","block")
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(e) {
                processZipFile(e.target.result)
            };
        }
    })
});

function submitHiddenForm(){
    var file = $("input[name='zip']").clone(true,true)
    var out = $("input[name='outfile']").clone(true,true)
    file.attr("name","file")
    file.css("display","hidden")
    out.attr("name","out")
    out.css("display","hidden")
    var selectedLangauge = $("select[name='languageSelect']").children(":selected").text()
    $("input[name='language']:hidden").attr("value",selectedLangauge)

    $("input[name='file']:hidden").replaceWith(file)
    $("input[name='out']:hidden").replaceWith(out)
    $('#request').submit()
}
function initJsTree(){
    $(function () {
        $('#directoryTree').jstree();
        $('#directoryTree').on("ready.jstree", function (e, data) {
            var li = $('#directoryTree').find("i.material-icons")
            li.map(function(index,element){
                element.innerHTML = "insert_drive_file"
            })
        });
        $('#directoryTree').on("after_open.jstree", function (e, data) {
            var li = $('#directoryTree').find("i.material-icons")
            li.map(function(index,element){
                element.innerHTML = "insert_drive_file"
            })
        });


    });
}
function setEntry(element, path){
    $("input[name='entry']:hidden").attr("value",path)
}
