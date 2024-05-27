package org.intellij.sdk.language;

import com.intellij.json.JsonFileType;
import org.jetbrains.annotations.NotNull;

import javax.swing.*;

public class GeoJSONFileType extends JsonFileType {
    public static final GeoJSONFileType INSTANCE = new GeoJSONFileType();

    private GeoJSONFileType() {
        super(GeoJSONLanguage.INSTANCE);
    }

    @NotNull
    @Override
    public String getName() {
        return "GeoJSON File";
    }

    @NotNull
    @Override
    public String getDescription() {
        return "GeoJSON is a format for encoding a variety of geographic data structures";
    }

    @NotNull
    @Override
    public String getDefaultExtension() {
        return "geojson";
    }

    @Override
    public Icon getIcon() {
        return GeoJSONIcons.FILE;
    }
}
