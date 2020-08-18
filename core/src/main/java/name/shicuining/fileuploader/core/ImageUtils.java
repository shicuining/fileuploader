package name.shicuining.fileuploader.core;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

@Component
public class ImageUtils {

    @Value("${fileUploader.image.save-path}")
    private String save_path;

    public static final String base_path = "/files/images/";

    public static String ext(String filename) {
        int index = filename.lastIndexOf(".");
        if (index == -1) {
            return null;
        }
        String result = filename.substring(index + 1);
        return result;
    }

    public String save(MultipartFile file) throws IOException {
        String orgName = file.getOriginalFilename();
        String ext = ext(orgName);
        String path = new SimpleDateFormat("yyyy").format(new Date())
                + "/" + new SimpleDateFormat("MM").format(new Date())
                + "/" + new SimpleDateFormat("dd").format(new Date())
                + "/" + new SimpleDateFormat("HH").format(new Date())
                + "/";
        String fileName = UUID.randomUUID().toString() + "." + ext;
        File dest = new File(save_path + path + fileName);
        if (!dest.getParentFile().exists()) {
            dest.getParentFile().mkdirs();
        }
        file.transferTo(dest);
        return base_path + path + fileName;
    }
}
