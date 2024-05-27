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
import com.intellij.ui.jcef.*;
import kotlin.Function;
import kotlin.jvm.functions.Function0;
import net.minidev.json.JSONObject;
import net.minidev.json.parser.JSONParser;
import net.minidev.json.parser.ParseException;
import nonapi.io.github.classgraph.json.JSONSerializer;
import org.cef.browser.CefBrowser;
import org.cef.browser.CefFrame;
import org.cef.handler.*;
import org.cef.misc.BoolRef;
import org.cef.network.CefRequest;
import org.intellij.images.editor.impl.jcef.CefLocalRequestHandler;
import org.intellij.images.editor.impl.jcef.CefStreamResourceHandler;
import org.jetbrains.annotations.Nls;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import javax.swing.*;
import java.awt.*;
import java.beans.PropertyChangeListener;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Objects;
import java.util.function.Consumer;
import java.util.function.Supplier;

public class GeoJSONPreview extends UserDataHolderBase implements FileEditor {
    private final VirtualFile file;
    private final JPanel panel = new JPanel(new BorderLayout());

    private final String PROTOCOL = "http";
    private final String HOSTNAME = "localhost";

    private final String VIEWER_PATH = "/index.html";
    private final String SCRIPT_PATH = "/script.js";

    private final String VIEWER_URL = PROTOCOL + "://" + HOSTNAME + VIEWER_PATH;

    private final JBCefClient ourCefClient = JBCefApp.getInstance().createClient();
    private final RequestHandler requestHandler = new RequestHandler();
    private final LoadHandler loadHandler;
    private final JBCefBrowserBase browser;

    public GeoJSONPreview(@NotNull Project project, @NotNull VirtualFile virtualFile) {
        this.file = virtualFile;
        this.loadHandler = new LoadHandler(virtualFile);

        requestHandler.addResource(VIEWER_PATH, () -> new CefStreamResourceHandler(
                Objects.requireNonNull(getClass().getClassLoader().getResourceAsStream("map-view/index.html")),
                "text/html",
                this
        ));
        requestHandler.addResource(SCRIPT_PATH, () -> new CefStreamResourceHandler(
                Objects.requireNonNull(getClass().getClassLoader().getResourceAsStream("map-view/script.js")),
                "application/javascript",
                this
        ));

        browser = new JBCefBrowserBuilder().setClient(ourCefClient).setEnableOpenDevToolsMenuItem(true).build();

        ourCefClient.addRequestHandler(requestHandler, browser.getCefBrowser());
        ourCefClient.addLoadHandler(loadHandler, browser.getCefBrowser());

        browser.loadURL(VIEWER_URL);

        this.panel.add(browser.getComponent(), BorderLayout.CENTER);

        Document doc = FileDocumentManager.getInstance().getDocument(virtualFile);

        doc.addDocumentListener(new FileListener(data -> {
            JSONParser parser = new JSONParser(JSONParser.DEFAULT_PERMISSIVE_MODE);
            JSONObject shape = null;

            try {
                shape = (JSONObject) parser.parse(data);
            } catch (ParseException e) {
                e.printStackTrace();
            }

            if (shape != null) {
                browser.getCefBrowser().executeJavaScript("setShape('" + shape.toJSONString() + "')", browser.getCefBrowser().getURL(), 0);
            }
        }));
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
        ourCefClient.removeRequestHandler(requestHandler, browser.getCefBrowser());
        ourCefClient.removeLoadHandler(loadHandler, browser.getCefBrowser());
    }
}

class LoadHandler extends CefLoadHandlerAdapter {
    private final Document document;

    public LoadHandler(VirtualFile file) {
        this.document = FileDocumentManager.getInstance().getDocument(file);;
    }

    @Override
    public void onLoadEnd(CefBrowser browser, CefFrame frame, int httpStatusCode) {
        JSONParser parser = new JSONParser(JSONParser.DEFAULT_PERMISSIVE_MODE);
        JSONObject shape = null;

        if (frame.isMain()) {
            try {
                shape = (JSONObject) parser.parse(document.getText());
            } catch (ParseException e) {
                e.printStackTrace();
            }

            if (shape != null) {
                browser.executeJavaScript("initialize('" + shape.toJSONString() + "')", browser.getURL(), 0);
            }
        }
    }
}

class RequestHandler extends CefRequestHandlerAdapter implements CefRequestHandler {
    private final CefLocalRequestHandler localRequestHandler = new CefLocalRequestHandler("http", "localhost");

    public void addResource(String resourcePath, Function0<? extends CefResourceHandler> resourceHandler) {
        localRequestHandler.addResource(resourcePath, resourceHandler);
    }

    @Override
    public CefResourceRequestHandler getResourceRequestHandler(CefBrowser browser, CefFrame frame, CefRequest request, boolean isNavigation, boolean isDownload, String requestInitiator, BoolRef disableDefaultHandling) {
        URL url = null;

        try {
            url = new URL(request.getURL());
        } catch (MalformedURLException e) {
            request.dispose();
        }

        if (url == null || !Objects.equals(url.getHost(), "localhost")) {
            return super.getResourceRequestHandler(browser, frame, request, isNavigation, isDownload, requestInitiator, disableDefaultHandling);
        }

        return localRequestHandler.getResourceRequestHandler(browser, frame, request, isNavigation, isDownload, requestInitiator, disableDefaultHandling);
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
