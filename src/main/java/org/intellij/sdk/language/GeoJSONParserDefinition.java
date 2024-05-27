package org.intellij.sdk.language;

import com.intellij.json.JsonParserDefinition;
import com.intellij.psi.FileViewProvider;
import com.intellij.psi.PsiFile;
import com.intellij.psi.tree.IFileElementType;
import org.jetbrains.annotations.NotNull;

public class GeoJSONParserDefinition extends JsonParserDefinition {
    @Override
    public @NotNull PsiFile createFile(@NotNull FileViewProvider fileViewProvider) {
        return new GeoJSONFileImpl(fileViewProvider);
    }

    @Override
    public @NotNull IFileElementType getFileNodeType() {
        return new IFileElementType(GeoJSONLanguage.INSTANCE);
    }
}
