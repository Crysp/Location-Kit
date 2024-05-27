package org.intellij.sdk.language;

import com.intellij.json.psi.impl.JsonFileImpl;
import com.intellij.openapi.fileTypes.FileType;
import com.intellij.psi.FileViewProvider;
import org.jetbrains.annotations.NotNull;

public class GeoJSONFileImpl extends JsonFileImpl {
    public GeoJSONFileImpl(FileViewProvider fileViewProvider) {
        super(fileViewProvider, GeoJSONLanguage.INSTANCE);
    }

    @Override
    public @NotNull FileType getFileType() {
        return GeoJSONFileType.INSTANCE;
    }
}
