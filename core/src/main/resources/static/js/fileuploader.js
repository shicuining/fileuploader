
var FileUploader = function() {
    this.config = {
        width: 100,
        height: 100,
        multiple: false,
        upload_url: ""
    };

    this.getTmpl = function () {
        var config = this.config;
        var _this = this;
        var tmpl = $(
            '<div class="fu-item">' +
            '    <div class="fu-show" style="width:' + config.width + 'px;height: ' + config.height + 'px;line-height: ' + config.height + 'px;">' +
            '       <div class="fu-show-plus fu-show-plus-a"></div>' +
            '       <div class="fu-show-plus fu-show-plus-b"></div>' +
            '    </div>' +
            '    <input class="fu-input" accept="image/*" type="file"  style="display: none" ' + (config.multiple ? "multiple" : "") + ' />' +
            '    <input type="hidden" class="fu-src">' +
            '    <div class="fu-loading">' +
            '       <div class="fu-loading-bg"></div>' +
            '       <div class="fu-loading-percentage" style="">0%</div>' +
            '    </div>' +
            '    <div class="fu-success"><div class="fu-success-content"></div></div>' +
            '</div>'
        );
        var showBox = tmpl.find(".fu-show");
        var input = tmpl.find(".fu-input");
        showBox.click(function () {
            input.click();
        });
        input.change(function () {
            var e = $(this)[0];
            for (var i = 0; i < e.files.length; i++) {
                _this.upload_start(tmpl, showBox, e.files[i])
            }
            $(this).val("");
        });
        return tmpl;
    }
    this.upload_start = function (tmpl, showBox, imgFile) {
        if (!/\/(?:jpeg|jpg|png)/i.test(imgFile.type)) {
            return;
        }
        var config = this.config;
        var _this = this;
        //异步读取文件
        var reader = new FileReader();
        reader.onload = function (evt) {
            var image = new Image();
            image.src = evt.target.result;
            image.onload = function (ev) {
                var width = image.width;
                var height = image.height;
                var toWidth = width;
                var toHeight = height;
                var mt = "auto";
                var ml = "auto";
                if (width > config.width || height > config.height) {
                    if (width / height > config.width / config.height) {
                        toHeight = height > config.height ? config.height : height;
                        toWidth = (toHeight / height) * width;
                        if (toWidth > config.width) {
                            ml = (-(toWidth - config.width) / 2) + "px"
                        }
                    } else {
                        toWidth = width > config.width ? config.width : width;
                        toHeight = (toWidth / width) * height;
                        if (toHeight > config.height) {
                            mt = (-(toHeight - config.height) / 2) + "px"
                        }
                    }
                }

                if (showBox.find("img").length > 0) {
                    showBox.find("img").attr("src", evt.target.result).css("width", toWidth + "px").css("height", toHeight + "px").css("margin-left", ml).css("margin-top", mt);
                    _this.upload_file(tmpl, imgFile)
                } else {
                    if (config.multiple) {
                        var newTmpl = _this.getTmpl();
                        var newShowBox = newTmpl.find(".fu-show");
                        newShowBox.css("font-size", "0");
                        newShowBox.html("<img style='vertical-align: middle; width:" + toWidth + "px;height:" + toHeight + "px;margin-left: " + ml + "; margin-top: " + mt + "; ' src='" + evt.target.result + "'>")
                        newTmpl.insertBefore(tmpl);
                        _this.upload_file(newTmpl, imgFile)
                    } else {
                        showBox.css("font-size", "0");
                        showBox.html("<img style='vertical-align: middle; width:" + toWidth + "px;height:" + toHeight + "px;margin-left: " + ml + "; margin-top: " + mt + "; ' src='" + evt.target.result + "'>");
                        _this.upload_file(tmpl, imgFile)
                    }
                }
            };
        }
        reader.readAsDataURL(imgFile);
    }
    this.upload_file = function (tmpl, imgFile) {
        var config = this.config;
        var _this = this;
        var progress = $(tmpl).find(".fu-loading");
        var item_success = $(tmpl).find(".fu-success");
        var src = $(tmpl).find(".fu-src");
        progress.show();
        item_success.hide();
        var formData = new FormData();
        formData.append("file", imgFile);
        $.ajax({
            url: config.url,
            async: true,
            type: "POST",
            data: formData,
            //dataType: "json",
            processData: false,
            contentType: false,
            success: function (url) {
                src.val(url);
                progress.hide();
                item_success.show();
            },
            xhr: function () {
                var xhr = $.ajaxSettings.xhr();
                xhr.upload.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        if (percentComplete == 1) {
                            percentComplete = 0.90;
                        }
                        progress.find(".fu-loading-percentage").html((percentComplete * 100) + "%")
                    }
                }, false);
                return xhr;
            },
            error: function (xhr) {
                console.log("error");
            }
        });
    }
    this.init = function (box, options) {
        this.config = $.extend({}, this.config, options);
        var tmpl = this.getTmpl();
        tmpl.appendTo(box);
        $('<div style="clear: both"></div>').appendTo(box);
    }
};

(function ($) {
    $.fn.extend({
        upload_img:function(upload_url, config){
            config.url = upload_url;
            var fileUploader = new FileUploader().init($(this),config);
            return fileUploader;
        }
    });
})(jQuery);