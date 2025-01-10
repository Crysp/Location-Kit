package org.intellij.sdk.language.ui

import org.cef.browser.CefBrowser
import org.cef.browser.CefFrame
import org.cef.handler.CefRequestHandler
import org.cef.handler.CefRequestHandlerAdapter
import org.cef.handler.CefResourceHandler
import org.cef.handler.CefResourceRequestHandler
import org.cef.misc.BoolRef
import org.cef.network.CefRequest
import org.intellij.images.editor.impl.jcef.CefLocalRequestHandler
import java.net.MalformedURLException
import java.net.URL

class GeoJSONMapViewRequestHandler(
    private val myProtocol: String,
    private val myAuthority: String
) : CefRequestHandlerAdapter(), CefRequestHandler {
    private val localRequestHandler = CefLocalRequestHandler(myProtocol, myAuthority)

    fun addResource(resourcePath: String?, resourceHandler: Function0<CefResourceHandler?>?) {
        localRequestHandler.addResource(resourcePath!!, resourceHandler!!)
    }

    override fun getResourceRequestHandler(
        browser: CefBrowser?,
        frame: CefFrame?,
        request: CefRequest,
        isNavigation: Boolean,
        isDownload: Boolean,
        requestInitiator: String?,
        disableDefaultHandling: BoolRef?
    ): CefResourceRequestHandler {
        var url: URL? = null

        try {
            url = URL(request.getURL())
        } catch (e: MalformedURLException) {
            request.dispose()
        }

        if (url == null || url.getHost() != myAuthority) {
            return super.getResourceRequestHandler(
                browser,
                frame,
                request,
                isNavigation,
                isDownload,
                requestInitiator,
                disableDefaultHandling
            )
        }

        return localRequestHandler.getResourceRequestHandler(
            browser,
            frame,
            request,
            isNavigation,
            isDownload,
            requestInitiator,
            disableDefaultHandling
        )
    }
}