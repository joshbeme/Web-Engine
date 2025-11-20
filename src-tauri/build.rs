use std::fs;
use std::path::PathBuf;
use typify;

fn main() {
    print!("rust build started");
    let mut matching_files = Vec::new();

    for entry in fs::read_dir("../bridge-type-schemas").unwrap() {
        let entry = entry.unwrap();
        let path = entry.path();
        if path.extension().and_then(|s| s.to_str()) == Some("json") {
            matching_files.push(path);
        }
    }

    println!("found schema files: {:?}", matching_files);
    // Path to your JSON Schema relative to Cargo.toml.
    // Make Cargo rebuild if the schema changes.

    // Build a TypeSpace with your desired settings.
    let mut typespace = typify::TypeSpace::new(
        typify::TypeSpaceSettings::default().with_struct_builder(true), // optional, if you want builders
    );

    for path in matching_files {
        println!("cargo:rerun-if-changed={}", path.display());
        // Read and parse the schema as a schemars RootSchema.
        let schema_text = fs::read_to_string(&path).expect("failed to read schema");
        let root_schema =
            serde_json::from_str(&schema_text).expect("schema must be valid JSON Schema");

        // println!("schema loaded {}", root_schema);
        println!("schema text {}", schema_text);
        println!("Adding schema file: {}", path.display());
        typespace
            .add_root_schema(root_schema)
            .expect("failed to add schema file");
    }
    // Add all types from the RootSchema ($defs and optionally the root).

    // Turn the TypeSpace into Rust code and pretty-print it.
    let file_stream = typespace.to_stream().to_string();

    // Write it into $OUT_DIR/mod.rs.
    let out_dir = PathBuf::from("src/bridge_types");
    let dest = out_dir.join("mod.rs");
    fs::write(&dest, &file_stream).expect("failed to write generated code");
    tauri_build::build()
}
