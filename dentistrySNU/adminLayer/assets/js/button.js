$(function () {
   
    
    $(document).on('focusin', ".file-upload .upload-hidden", (e) => {
        const $target = $(e.currentTarget);
        $target.data('val', $target.val());
    });

    $(document).on('change', ".file-upload .upload-hidden", (e) => {
        const target = e.currentTarget;
        const $target = $(e.currentTarget);
        const prevVal = $target.data('val');
        let $preview;
        const ext = $target.val().split('.').pop().toLowerCase();
        const $uploadName = $target.closest('.file-upload').find('.upload-name');

        if (window.FileReader) {  // modern browser
            var filename = target.files[0]?.name;
        } else {  // old IE
            var filename = $target.val().split('/').pop().split('\\').pop();  // 파일명만 추출
        }

        // 추출한 파일명 삽입
        $uploadName.removeClass('empty');
        $uploadName.val(filename);

        // Preview reset
        // $target.closest('.file-preview').find('.img-preview').remove();
        $target.closest('.file-preview').find('.video-preview').remove();

        // Preview
        if($.inArray(ext, ['gif','png','jpg','jpeg']) !== -1){
            // Image Files
            $preview = $target.closest('.file-preview').find('.img-preview');
            if(!$preview.length) {
                // $target.closest('.file-preview').prepend(`<img class="img-preview" src="" alt="">`);
                $preview = $target.closest('.file-preview').find('.img-preview');
            }
        } else if ($.inArray(ext, ['avi','mpg','mpeg','mp4']) !== -1) {
            // Video Files
            $preview = $target.closest('.file-preview').find('.video-preview');
            if(!$preview.length) {
                $target.closest('.file-preview').prepend(`<video class="video-preview" controls=""></video>`);
                $preview = $target.closest('.file-preview').find('.video-preview');
            }
        }
        
        readURL(target,$preview,ext);

        // if( $target.closest('.file-add-check').length && $target.closest('.tbl_tr').next().find('.file-add-check') && !prevVal || $target.closest('.tbl_ui').find('.file-add-check').length === 1){
        //     if ($target.closest('.single').length === 1) return;
        //     const idx = $target.closest('.tbl_ui').find('.file-add-check').length + 1;
        //     const limitedCapacityMsg = $target.closest('.file-add-check').next().text();
        //     const acceptList = $target.attr('accept');
        //     $target.closest('.tbl_tr').after(/* html */`
        //         <div class="tbl_tr type2">
        //             <div class="tbl_th">Attachment ${idx}</div>
        //             <div class="tbl_td">
        //                 <div class="col-12 px-1">
        //                     <div class="file-upload file-add-check">
        //                         <label>
        //                             <div class="label-btn btn btn-success">파일 선택</div>
        //                             <input type="file" class="upload-hidden" accept="${acceptList}">
        //                         </label>
        //                         <div class="upload-name-wrap">
        //                             <input type="text" class="upload-name form-control empty" value="등록 파일선택" disabled>
        //                             <div class="dim"></div>
        //                         </div>
        //                         <button class="btn btn-outline-success file-close" type="button"><i class="bx bx-x-circle"></i></button>
        //                     </div>
        //                     <span class="d-block mt-2">${limitedCapacityMsg}</span>
        //                 </div>
        //             </div>
        //         </div>
        //     `);
        // }

    });
    $(document).on('change', ".file-upload.file-add-check .upload-hidden", (e) => {
        const target = e.currentTarget;
        const $target = $(e.currentTarget);
        const prevVal = $target.data('val');
        let $preview;
        const ext = $target.val().split('.').pop().toLowerCase();
        const $uploadName = $target.closest('.file-upload').find('.upload-name');

        if (window.FileReader) {  // modern browser
            var filename = target.files[0]?.name;
        } else {  // old IE
            var filename = $target.val().split('/').pop().split('\\').pop();  // 파일명만 추출
        }
        // 추출한 파일명 삽입
        $uploadName.text(filename);
        $target.closest('.file-add-check').find('.file-close').show();
    })
    $(document).on('click', ".file-upload .dim", function (e) {
        const $target = $(e.currentTarget);
        $target.closest('.file-upload').find('.label-btn').trigger('click');
    });
    $(document).on('click','.file-upload .file-close',function(e){
        const $target = $(e.currentTarget);
        const $uploadName = $target.closest('.file-upload').find('.upload-name');
        const $fileHidden = $target.closest('.file-upload').find('.upload-hidden');
        let uploadPlaceholder = $uploadName.attr('data-placeholder');
        if(!uploadPlaceholder) $uploadName.attr('data-placeholder',$uploadName.attr('placeholder'));
        uploadPlaceholder = $uploadName.attr('data-placeholder');

    
        $uploadName.addClass('empty');
        $uploadName.val(uploadPlaceholder ? uploadPlaceholder : '등록 파일선택');
        $fileHidden.val('');
        $(this).closest('.file-preview').find('.img-preview').remove();
        $(this).closest('.file-preview').find('.video-preview').remove();

        const $fileAddCheckList = $target.closest('.tbl_ui').find('.file-add-check');
        if($target.closest('.file-add-check').length) {
            $(this).closest('.file-add-check').find('.upload-name').text('');
            $(this).hide();
        }
        // if($target.closest('.file-add-check').length && $fileAddCheckList.length !== 1){
        //     if($fileAddCheckList.length === 2 && $target.closest('.file-add-check')[0] !== $fileAddCheckList[0]) return
        //     const $tblUi = $target.closest('.tbl_ui');
        //     $target.closest('.tbl_tr').remove();
        //     $tblUi.find('.file-add-check').closest('.tbl_td').prev().each((i,t)=>{
        //         $(t).text(`Attachment ${i+1}`);
        //     });
        // }
    });

    $(document).on('click', '.btn-preview',function (e) {
        const $this =  $(e.currentTarget);
        const $fileUpload = $this.closest('.file-upload');
        const $uploadHidden = $fileUpload.find('.upload-hidden')[0];
        const $previewImg = $('.preview_thumb .img');

        $previewImg.attr('src','');
        readURL($uploadHidden,$previewImg);
    });

    $('html').click(function (e) {
        if ($(e.target).parents('.etc_area').length < 1) {
            $('.etc_area .etc_inner').removeClass('active');
        }
    });
    $('.etc_area .nav-item').click(function (e) {
        e.preventDefault();
        $('.etc_area .etc_inner').toggleClass('active');
    });

    $(document).on('click', '.toggle-toast-msg',function (e) {
        const $this = $(e.currentTarget);
        let msg = $this.attr('data-toast-msg');
        let $toastContainer = fn.exists('.toast-container') && $('.toast-container');
        let totalNum = $toastContainer ? Number($toastContainer.attr('data-add-num')) : 0;

        if (fn.exists('.toast-container')) {
            $('.toast-container').attr('data-add-num',totalNum + 1);
            $('.toast-container').append(`
                <div class="msg-toast${totalNum} bs-toast toast m-2 fade bg-primary hide" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header pb-0">
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        ${msg}
                    </div>
                </div>
            `);
        } else {
            $('body').append(`
                <div class="toast-container toast-placement-ex">
                    <div class="msg-toast${totalNum} bs-toast toast m-2 fade bg-primary hide" role="alert" aria-live="assertive" aria-atomic="true">
                        <div class="toast-header pb-0">
                            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                        <div class="toast-body">
                            ${msg}
                        </div>
                    </div>
                </div>
            `);
            $('.toast-container').attr('data-add-num',totalNum + 1);
        }
        $(`.msg-toast${totalNum}`).toast({animation:true, autohide: true, delay:2000});
        $(`.msg-toast${totalNum}`).toast('show');
    });

    $(document).on('click', '.counter-control .btn-decrease',function (e) {
        const $this =  $(e.currentTarget);
        const $counterNum = $this.closest('.counter-control').find('.counter-num');
        let counterNum = $counterNum.text();
        counterNum--;
        if (counterNum <= 0){
            counterNum = 0;
        }
        $counterNum.text(counterNum);
    });
    $(document).on('click', '.counter-control .btn-increase',function (e) {
        const $this =  $(e.currentTarget);
        const $counterNum = $this.closest('.counter-control').find('.counter-num');
        let counterNum = $counterNum.text();
        counterNum++;
        $counterNum.text(counterNum);
    });
});

function readURL(input,$preview) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $preview.attr('src','');
            $preview.attr('src',e.target.result);
            $preview.hide();
            $preview.fadeIn(650);
        }
        reader.readAsDataURL(input.files[0]);
    }
}