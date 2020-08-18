package name.shicuining.fileuploader.demo.controllers;

import name.shicuining.fileuploader.core.ImageUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.security.Guard;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

@Controller
public class HomeController {

    @RequestMapping({"/"})
    public String index(Model model) {
        return "index";
    }

    @Autowired
    ImageUtils imageUtils;

    @ResponseBody
    @RequestMapping("/upload")
    public String upload(HttpServletRequest request,@RequestParam(value = "file") MultipartFile file) throws IOException {
       return  imageUtils.save(file);
    }

    public static String ext(String filename) {
        int index = filename.lastIndexOf(".");
        if (index == -1) {
            return null;
        }
        String result = filename.substring(index + 1);
        return result;
    }

    public class upload_result{
        private String url;

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }
    }

}
