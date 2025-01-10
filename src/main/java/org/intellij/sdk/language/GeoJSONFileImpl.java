package org.intellij.sdk.language;

import com.intellij.extapi.psi.PsiFileBase;
import com.intellij.json.psi.JsonFile;
import com.intellij.json.psi.JsonValue;
import com.intellij.openapi.fileTypes.FileType;
import com.intellij.psi.FileViewProvider;
import com.intellij.psi.util.PsiTreeUtil;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.util.List;

public class GeoJSONFileImpl extends PsiFileBase implements JsonFile {
    public GeoJSONFileImpl(FileViewProvider fileViewProvider) {
        super(fileViewProvider, GeoJSONLanguage.INSTANCE);
    }

    @Override
    public @NotNull FileType getFileType() {
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
        return "GeoJSONFile: " + getName();
    }
}
