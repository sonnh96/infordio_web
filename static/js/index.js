function uploadFile() {
	$('.modal-backdrop').click(function() {
		$('#files-modal').modal('toggle');
	});
	var isAdvancedUpload = function() {
		var div = document.createElement('div');
		return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
	}();
	$('#file1').on( 'change', function( e ){
		droppedFiles = e.target.files;
		$('label#file-name').text(droppedFiles[0].name);	
	});
	if( isAdvancedUpload ){
		$('form').on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
			e.preventDefault();
			e.stopPropagation();
		});
		$('form').on('dragover dragenter', function(){
			$(this).addClass('is-dragover');
		});
		$('form').bind('dragleave', function(){
			$(this).removeClass('is-dragover');
		});
		$('form').bind('drop', function(e){
			$(this).removeClass('is-dragover');
			droppedFiles = e.originalEvent.dataTransfer.files;
			$('form').find('input[type="file"]').prop('files', droppedFiles);
			$('label#file-name').text(droppedFiles[0].name);
		});
	};
	$("form").submit(function(e){
		e.preventDefault();
		$('body').addClass("loading");
	    var data = new FormData();
	    data.append('file',$("#file1")[0].files[0]);
        $.ajax({
            url: "/",
            type: "POST",
            data: data,
            mimeTypes:"multipart/form-data",
            contentType: false,
            processData: false,
            success: function(res){
             	$('body').removeClass("loading");
             	$('.upload-box').remove();
             	$('.main-content').show();
             	var html1 = '<img class="rimages" src="data:image/png;base64,'+res.img+'">';
             	$('.box-image').append(html1);
             	var html2 = '<img class="rimages" src="static/img/'+res.raw+'">';
             	$('.origin-image').append(html2);
             	textFill(res.text.result);
            },error: function(res){
            	$('body').removeClass("loading")
                alert(res);
            }
         });
        
	});
}

function autoUpload(){
	$('#file2').on( 'change', function( e ){
		$('body').addClass("loading");
		var file = e.target.files;
		$('label#file-name').text(file[0].name);	
		var data = new FormData();
	    data.append('file',$("#file2")[0].files[0]);
        $.ajax({
            url: "/",
            type: "POST",
            data: data,
            mimeTypes:"multipart/form-data",
            contentType: false,
            processData: false,
            success: function(res){
            	console.log(res);
             	$('body').removeClass("loading");
             	$('.box-image').empty();
             	$('.origin-image').empty();
             	var html1 = '<img class="rimages" src="data:image/png;base64,'+res.img+'">';
             	$('.box-image').append(html1);
             	var html2 = '<img class="rimages" src="static/img/'+res.raw+'">';
             	$('.origin-image').append(html2);
             	textFill(res.text.result);
            },error: function(res){
            	$('body').removeClass("loading");
                alert(res);
            }
         });
	});
}

function textFill(res){
	var html = "";
	for(var i = 0; i < res.length; i++){
		html += '<tr>';
		html += '<td>'+res[i].id+'</td>';
		html += '<td>'+res[i].text+'</td>';
		html += '</tr>';
	}
	$('tbody').append(html);
}

$(document).ready(function () {
    uploadFile();

	autoUpload();
	$('.btn-clear').click(function(){
		window.location.reload();
	})

	$('.modal-dialog').draggable({
		axis: "y",
		scroll: false
	});
	
	$(document).on('click','.rimages', function(){
    	$('.imagepreview').attr('src', $(this).attr('src'));
		$('#imagemodal').modal('show');
		var zX = 1;
		$('.modal-dialog').bind('mousewheel', function(e){
			var dir = 0;
			 if(e.originalEvent.wheelDelta > 0) {
			 	dir += 0.1;
	        }
	        else{
	            dir -= 0.1;
	        }
		    zX += dir;
		    if (zX < 2) {
		    	$(this).css('transform', 'scale(' + zX + ')');
		    }
		});
	});
});