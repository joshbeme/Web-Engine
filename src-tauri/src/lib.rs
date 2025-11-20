// mod app_state;
// mod bridge_types;
mod commands;

use commands::on_change_state;
use tauri::generate_context;
use tauri::generate_handler;
// use bridge_types::AppState
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // let mut app_state = AppState {};
    tauri::Builder::default()
        .invoke_handler(generate_handler![on_change_state])
        .run(generate_context!())
        .expect("error while running tauri application");
}
