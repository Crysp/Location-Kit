package org.intellij.sdk.language.ui;

import com.intellij.openapi.editor.Document;
import com.intellij.openapi.editor.event.DocumentEvent;
import com.intellij.openapi.editor.event.DocumentListener;
import com.intellij.openapi.fileEditor.FileDocumentManager;
import com.intellij.openapi.fileEditor.FileEditor;
import com.intellij.openapi.fileEditor.FileEditorState;
import com.intellij.openapi.project.Project;
import com.intellij.openapi.util.UserDataHolderBase;
import com.intellij.openapi.vfs.VirtualFile;
import org.jetbrains.annotations.Nls;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import javax.swing.*;
import java.awt.*;
import java.beans.PropertyChangeListener;

public class GeoJSONPreview extends UserDataHolderBase implements FileEditor {
    private final VirtualFile file;
    private final JPanel panel = new JPanel(new BorderLayout());
    private final GeoJSONMapView mapView;

    public GeoJSONPreview(@NotNull Project project, @NotNull VirtualFile virtualFile) {
        this.file = virtualFile;
        this.mapView = new GeoJSONMapView(project, virtualFile);

        this.panel.add(mapView.getComponent(), BorderLayout.CENTER);

        Document doc = FileDocumentManager.getInstance().getDocument(virtualFile);

        assert doc != null;

        doc.addDocumentListener(new FileListener(mapView::setShape));
    }

    @Override
    public @NotNull JComponent getComponent() {
        return panel;
    }

    @Override
    public @Nullable JComponent getPreferredFocusedComponent() {
        return null;
    }

    @Override
    public @Nls(capitalization = Nls.Capitalization.Title) @NotNull String getName() {
        return "GeoJSON Preview";
    }

    @Override
    public VirtualFile getFile() {
        return file;
    }

    @Override
    public void setState(@NotNull FileEditorState state) {

    }

    @Override
    public boolean isModified() {
        return false;
    }

    @Override
    public boolean isValid() {
        return file.isValid();
    }

    @Override
    public void addPropertyChangeListener(@NotNull PropertyChangeListener listener) {

    }

    @Override
    public void removePropertyChangeListener(@NotNull PropertyChangeListener listener) {

    }

    @Override
    public void dispose() {
        mapView.dispose();
    }
}

interface Callback {
    void call(String data);
}

class FileListener implements DocumentListener {
    final private Callback callback;

    public FileListener(Callback callback) {
        this.callback = callback;
    }

    @Override
    public void documentChanged(@NotNull DocumentEvent event) {
        DocumentListener.super.documentChanged(event);

        this.callback.call(event.getDocument().getText());
    }
}
