package org.intellij.sdk.language;

import com.intellij.extapi.psi.PsiFileBase;
import com.intellij.json.psi.impl.JsonFileImpl;
import com.intellij.psi.FileViewProvider;
import com.intellij.openapi.fileTypes.FileType;
import org.jetbrains.annotations.NotNull;

public class GeoJSONFile extends JsonFileImpl {
    public GeoJSONFile(@NotNull FileViewProvider viewProvider) {
        super(viewProvider, GeoJSONLanguage.INSTANCE);
    }

    @NotNull
    @Override
    public FileType getFileType() {
        return GeoJSONFileType.INSTANCE;
    }

    @Override
    public String toString() {
        return "GeoJSON File";
    }
}
