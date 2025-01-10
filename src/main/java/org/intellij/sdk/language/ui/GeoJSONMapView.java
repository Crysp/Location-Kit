package org.intellij.sdk.language.ui;

import com.intellij.ide.ui.LafManagerListener;
import com.intellij.openapi.Disposable;
import com.intellij.openapi.application.ApplicationManager;
import com.intellij.openapi.editor.Document;
import com.intellij.openapi.editor.colors.EditorColorsManager;
import com.intellij.openapi.fileEditor.FileDocumentManager;
import com.intellij.openapi.project.Project;
import com.intellij.openapi.vfs.VirtualFile;
import com.intellij.ui.jcef.JBCefApp;
import com.intellij.ui.jcef.JBCefBrowserBase;
import com.intellij.ui.jcef.JBCefBrowserBuilder;
import com.intellij.ui.jcef.JBCefClient;
import net.minidev.json.JSONObject;
import net.minidev.json.parser.JSONParser;
import net.minidev.json.parser.ParseException;
import org.cef.browser.CefBrowser;
import org.cef.browser.CefFrame;
import org.cef.handler.*;
import org.intellij.images.editor.impl.jcef.CefStreamResourceHandler;
import org.jetbrains.annotations.NotNull;

import javax.swing.*;
import java.lang.reflect.Array;
import java.util.*;

public class GeoJSONMapView implements Disposable {
    private final String PROTOCOL = "http";
    private final String HOSTNAME = "localhost";

    private final String ROOT_PATH = "map-view/dist";
    private final String VIEWER_PATH = "/index.html";
    private final String SCRIPT_PATH = "/assets/index.js";
    private final String STYLES_PATH = "/assets/index.css";
    private final List<String> FONTS_PATHS_LIST = Arrays.asList(
            "/fonts/jetbrains-mono-cyrillic.woff2",
            "/fonts/jetbrains-mono-cyrillic-ext.woff2",
            "/fonts/jetbrains-mono-greek.woff2",
            "/fonts/jetbrains-mono-italic-cyrillic.woff2",
            "/fonts/jetbrains-mono-italic-cyrillic-ext.woff2",
            "/fonts/jetbrains-mono-italic-greek.woff2",
            "/fonts/jetbrains-mono-italic-latin.woff2",
            "/fonts/jetbrains-mono-italic-latin-ext.woff2",
            "/fonts/jetbrains-mono-italic-vietnamese.woff2",
            "/fonts/jetbrains-mono-latin.woff2",
            "/fonts/jetbrains-mono-latin-ext.woff2",
            "/fonts/jetbrains-mono-vietnamese.woff2"
    );

    private final String VIEWER_URL = PROTOCOL + "://" + HOSTNAME + VIEWER_PATH;
    private final String SCRIPT_URL = PROTOCOL + "://" + HOSTNAME + SCRIPT_PATH;
    private final String STYLES_URL = PROTOCOL + "://" + HOSTNAME + STYLES_PATH;

    private final JBCefClient ourCefClient = JBCefApp.getInstance().createClient();
    private final GeoJSONMapViewRequestHandler requestHandler = new GeoJSONMapViewRequestHandler(PROTOCOL, HOSTNAME);
    private final LoadHandler loadHandler;
    private final JBCefBrowserBase browser;

    public GeoJSONMapView(@NotNull Project project, @NotNull VirtualFile virtualFile) {
        this.loadHandler = new LoadHandler(virtualFile);
        Map<String, String> headers = new HashMap<>();

        requestHandler.addResource(VIEWER_PATH, () -> new CefStreamResourceHandler(
                Objects.requireNonNull(getClass().getClassLoader().getResourceAsStream(ROOT_PATH + VIEWER_PATH)),
                "text/html",
                this,
                headers
        ));
        requestHandler.addResource(SCRIPT_PATH, () -> new CefStreamResourceHandler(
                Objects.requireNonNull(getClass().getClassLoader().getResourceAsStream(ROOT_PATH + SCRIPT_PATH)),
                "application/javascript",
                this,
                headers
        ));
        requestHandler.addResource(STYLES_PATH, () -> new CefStreamResourceHandler(
                Objects.requireNonNull(getClass().getClassLoader().getResourceAsStream(ROOT_PATH + STYLES_PATH)),
                "text/css",
                this,
                headers
        ));

        FONTS_PATHS_LIST.forEach(path -> requestHandler.addResource(path, () -> new CefStreamResourceHandler(
                Objects.requireNonNull(getClass().getClassLoader().getResourceAsStream(ROOT_PATH + path)),
                "font/woff2",
                this,
                headers
        )));

        browser = new JBCefBrowserBuilder().setClient(ourCefClient).setEnableOpenDevToolsMenuItem(true).build();

        ourCefClient.addRequestHandler(requestHandler, browser.getCefBrowser());
        ourCefClient.addLoadHandler(loadHandler, browser.getCefBrowser());

        browser.loadURL(VIEWER_URL);

        ApplicationManager.getApplication().getMessageBus().connect(project)
                .subscribe(
                        LafManagerListener.TOPIC,
                        (LafManagerListener) source -> {
                            if (EditorColorsManager.getInstance().isDarkEditor()) {
                                this.setMapDarkStyle();
                            } else {
                                this.setMapLightStyle();
                            }
                        }
                );
    }

    public JComponent getComponent() {
        return browser.getComponent();
    }

    public void setShape(@NotNull String shape) {
        browser.getCefBrowser().executeJavaScript("setShape(`" + shape.replace("\n", "") + "`)", browser.getCefBrowser().getURL(), 0);
    }

    public void setMapDarkStyle() {
        browser.getCefBrowser().executeJavaScript("setStyle(true)", browser.getCefBrowser().getURL(), 0);
    }

    public void setMapLightStyle() {
        browser.getCefBrowser().executeJavaScript("setStyle(false)", browser.getCefBrowser().getURL(), 0);
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
        this.document = FileDocumentManager.getInstance().getDocument(file);
    }

    @Override
    public void onLoadEnd(CefBrowser browser, CefFrame frame, int httpStatusCode) {
        if (frame.isMain()) {
            browser.executeJavaScript("setShape(`" + document.getText().replace("\n", "") + "`)", browser.getURL(), 0);
        }
    }
}
