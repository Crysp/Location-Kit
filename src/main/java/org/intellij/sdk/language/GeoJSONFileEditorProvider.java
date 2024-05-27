package org.intellij.sdk.language;

import com.intellij.openapi.fileEditor.*;
import com.intellij.openapi.fileEditor.impl.text.TextEditorProvider;
import com.intellij.openapi.project.DumbAware;
import com.intellij.openapi.project.Project;
import com.intellij.openapi.vfs.VirtualFile;
import org.intellij.sdk.language.ui.GeoJSONPreview;
import org.jetbrains.annotations.NonNls;
import org.jetbrains.annotations.NotNull;

public class GeoJSONFileEditorProvider implements FileEditorProvider, DumbAware {
    @Override
    public boolean accept(@NotNull Project project, @NotNull VirtualFile file) {
        return file.getFileType().getName().equals(GeoJSONFileType.INSTANCE.getName());
    }

    @Override
    public @NotNull FileEditor createEditor(@NotNull Project project, @NotNull VirtualFile file) {
        TextEditor sourceEditor = (TextEditor) TextEditorProvider.getInstance().createEditor(project, file);
        FileEditor preview = new GeoJSONPreview(project, file);

        return new TextEditorWithPreview(sourceEditor, preview);
    }

    @Override
    public @NotNull @NonNls String getEditorTypeId() {
        return "geojson-editor";
    }

    @Override
    public @NotNull FileEditorPolicy getPolicy() {
        return FileEditorPolicy.HIDE_DEFAULT_EDITOR;
    }
}
