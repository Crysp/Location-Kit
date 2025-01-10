package org.intellij.sdk.language;

import com.intellij.extapi.psi.PsiFileBase;
import com.intellij.json.psi.JsonFile;
import com.intellij.json.psi.JsonValue;
import com.intellij.json.psi.impl.JsonFileImpl;
import com.intellij.psi.FileViewProvider;
import com.intellij.openapi.fileTypes.FileType;
import com.intellij.psi.util.PsiTreeUtil;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.util.List;

public class GeoJSONFile extends PsiFileBase implements JsonFile {
    public GeoJSONFile(FileViewProvider fileViewProvider) {
        super(fileViewProvider, GeoJSONLanguage.INSTANCE);
    }

    @NotNull
    @Override
    public FileType getFileType() {
        return GeoJSONFileType.INSTANCE;
    }

    @Override
    public @Nullable JsonValue getTopLevelValue() {
        return PsiTreeUtil.getChildOfType(this, JsonValue.class);
    }

    @Override
    public @NotNull List<JsonValue> getAllTopLevelValues() {
        return PsiTreeUtil.getChildrenOfTypeAsList(this, JsonValue.class);
    }

    @Override
    public String toString() {
        return "GeoJSON File";
    }
}
