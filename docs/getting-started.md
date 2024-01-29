---
outline: deep
---

# Getting Started

1. Download [OpenFlier](/Setup.exe)
2. Find "OpenFlier.Plugin.dll"
3. Create a C# Library Project in your preferred way.
4. Reference "OpenFlier.Plugin.dll"
5. Modify your \*.csproj file as follows:

```xml
<Project Sdk="Microsoft.NET.Sdk">

	<PropertyGroup>
		<TargetFramework>net6.0</TargetFramework>
		<ImplicitUsings>enable</ImplicitUsings>
		<Nullable>enable</Nullable>
		<EnableDynamicLoading>true</EnableDynamicLoading> // [!code ++]
	</PropertyGroup>


	<ItemGroup>
		<Reference Include="OpenFlier.Plugin">
	        <HintPath>PATH\TO\OPENFLIER.PLUGIN.DLL</HintPath>
	        <Private>false</Private> // [!code ++]
	        <ExcludeAssets>runtime</ExcludeAssets> // [!code ++]
        </Reference>
	</ItemGroup>

</Project>

```

6. Add using to your \*.cs file:

```csharp
using OpenFlier.Plugin
```

7. Implement either `ICommandInputPlugin` or `IMqttMessagePlugin`, choose the one you need.

## Examples

### `ICommandInputPlugin`

Remember: `static` works!

```csharp
using MQTTnet;
using MQTTnet.Protocol;
using MQTTnet.Server;
using Newtonsoft.Json;
using OpenFlier.Plugin;
using System.Drawing;
using System.Drawing.Imaging;
using System.Text;

namespace RemoteRandom
{
    public class RemoteRandomPlugin : ICommandInputPlugin
    {
        public static HttpClient? client = null;
        private CommandInputPluginInfo pluginInfo = new()
        {
            InvokeCommands = new List<string>(new[] { "rr", "RemoteRandom" }),
            PluginDescription = "Fetches a random image from a remote source.",
            PluginVersion = "0.0.1",
            PluginIdentifier = "openflier.ext.remoterandom",
            PluginAuthor = "The OpenFlier Contributors",
            PluginName = "Remote Random",
            PluginNeedsConfigEntry = true,
        };
        public CommandInputPluginInfo GetPluginInfo()
        {
            return pluginInfo;
        }

        public async Task PluginMain(CommandInputPluginArgs args)
        {
            if(client is null)
                client = new HttpClient();
            var filename = Guid.NewGuid().ToString("N");
            var usePng = args.UsePng;
            var imageStream = await client.GetStreamAsync("https://api.aixiaowai.cn/api/api.php");
            Image bitmap = Bitmap.FromStream(imageStream);
            bitmap.Save(
                $"Screenshots\\{filename}.{(usePng ? "png" : "jpeg")}",
                usePng ? ImageFormat.Png : ImageFormat.Jpeg
            );
            bitmap.Dispose();
            imageStream.Close();
            string payload = JsonConvert.SerializeObject(
                new
                {
                    type = 20005L,
                    data = new
                    {
                        name = $"{filename}.{(usePng ? "png" : "jpeg")}",
                        deviceCode = args.MachineIdentifier,
                        versionCode = args.Version,
                    }
                }
            );
            await args.MqttServer.PublishAsync(new MqttApplicationMessage
            {
                Topic = args.ClientID + "/REQUEST_SCREEN_CAPTURE",
                Payload = Encoding.Default.GetBytes(payload),
                QualityOfServiceLevel = MqttQualityOfServiceLevel.ExactlyOnce
            });
        }

        public void PluginOpenConfig()
        {
            throw new NotImplementedException();
        }
    }
}
```

### `IMqttServicePlugin`

Mostly not needed.

```csharp
using MQTTnet;
using MQTTnet.Server;
using OpenFlier.Plugin;
using System.Text;
using System.Windows;

namespace DemoPlugin
{
    public class DemoPlugin : IMqttServicePlugin
    {
        public MqttServicePluginInfo GetPluginInfo()
        {
            return new MqttServicePluginInfo
            {
                MqttMessageType = 30000L,
                PluginAuthor = "The OpenFlier Authors",
                PluginName = "DemoPlugin",
                PluginIdentifier = "openflier.dev.demo",
                PluginNeedsConfigEntry = false,
                PluginVersion = "0.1",
                PluginDescription = "Testing plugin functionality.",
                PluginNeedsAdminPrivilege = false,
            };
        }


        public async Task PluginMain(string clientID, IMqttServer mqttServer)
        {
            MessageBox.Show("A message from DemoPlugin");
            string payloadString = "{\"data\":null,\"type\":30001}";
            await mqttServer.PublishAsync(new MqttApplicationMessage
            {
                Topic = "test",
                Payload = Encoding.Default.GetBytes(payloadString),
                QualityOfServiceLevel = MQTTnet.Protocol.MqttQualityOfServiceLevel.ExactlyOnce
            });
        }

        public void PluginOpenConfig()
        {
            return;
        }
    }
}
```
