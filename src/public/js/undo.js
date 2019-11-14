$( document ).ready(function() {
    $("input[name='source']").on("change",function(){
        var filename = $(this).val()
        $("#filename").val(filename.split("\\").pop().split("/").pop())

    })

    $("button[name='action']").on("click", function(){
        submitHiddenForm();
    })
});

function submitHiddenForm(){
    var file = $("input[name='source']").clone(true,true)
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
