---
outline: deep
---
# How Plugins Work
## Find
OpenFlier looks up in its config file to determine whether a compatible plugin exists.

:::tip
OpenFlier only loads the first compatible plugin occurred in its config file, so make sure your plugin does not share the same invoke conditions with others.
:::

## Load
If OpenFlier finds a compatible plugin, it looks up in its plugin cache to see whether the plugin has already been loaded. If not, OpenFlier creates an instance of the plugin, and calls `PluginMain()`

:::info
During one startup of OpenFlier, one plugin only has **one** instance.
:::
:::warning
Plugin cache relies on PluginIdentifier, so make sure yours does not contradict with others.
:::
:::warning
OpenFlier only create an instance of the first class with the interface `ICommandInputPlugin` or `IMqttServicePugin`, and the order is determined by `Assembly.GetTypes()`. It is suggest that one plugin file only contains one plugin interface implementation.
:::

## The `BeforeExit` Hook <Badge type="tip" text=">1.1.0" />
Both `ICommandInputPlugin` and `IMqttServicePlugin` have a `BeforeExit` hook which will be executed before the application fully quits. It is executed **AFTER** the MQTT Server is shut down. 