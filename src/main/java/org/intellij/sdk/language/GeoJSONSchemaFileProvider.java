package org.intellij.sdk.language;

import com.intellij.openapi.fileTypes.FileType;
import com.intellij.openapi.util.NullableLazyValue;
import com.intellij.openapi.vfs.VirtualFile;
import com.jetbrains.jsonSchema.extension.JsonSchemaFileProvider;
import com.jetbrains.jsonSchema.extension.JsonSchemaProviderFactory;
import com.jetbrains.jsonSchema.extension.SchemaType;
import org.jetbrains.annotations.Nls;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

public class GeoJSONSchemaFileProvider implements JsonSchemaFileProvider {
    private final String fileTypeName;
    private final Class<? extends FileType> fileTypeType;
    private final String resourcePath;
    private final NullableLazyValue<VirtualFile> schemaFile;

    public GeoJSONSchemaFileProvider(@NotNull FileType fileType, @NotNull String resourcePath) {
        this.fileTypeName = fileType.getName();
        this.fileTypeType = fileType.getClass();
        this.resourcePath = resourcePath;
        this.schemaFile = NullableLazyValue.lazyNullable(() -> JsonSchemaProviderFactory.getResourceFile(GeoJSONSchemaFileProvider.class, this.resourcePath));
    }

    @Override
    public boolean isAvailable(@NotNull VirtualFile file) {
        return fileTypeType.isInstance(file.getFileType());
    }

    @Override
    public @NotNull @Nls String getName() {
        return fileTypeName + " Schema";
    }

    @Override
    public @Nullable VirtualFile getSchemaFile() {
        return schemaFile.getValue();
    }

    @Override
    public @NotNull SchemaType getSchemaType() {
        return SchemaType.embeddedSchema;
    }
}
