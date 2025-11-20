// use super::bridge_types::{CommandsOnChangeParameters, CommandsOnChangeParametersData};
use tauri::command;

#[tauri::command]
pub fn on_change_state(_state_change: String, _data: String) {
    // Handle the state change here
}
