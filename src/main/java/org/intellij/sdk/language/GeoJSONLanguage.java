package org.intellij.sdk.language;

import com.intellij.json.JsonLanguage;

public class GeoJSONLanguage extends JsonLanguage {
    public static final GeoJSONLanguage INSTANCE = new GeoJSONLanguage();

    private GeoJSONLanguage() {
        super("GeoJSON");
    }
}
