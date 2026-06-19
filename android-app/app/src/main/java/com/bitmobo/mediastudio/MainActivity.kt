package com.bitmobo.mediastudio

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.AudioFile
import androidx.compose.material.icons.rounded.Bolt
import androidx.compose.material.icons.rounded.CheckCircle
import androidx.compose.material.icons.rounded.Download
import androidx.compose.material.icons.rounded.Link
import androidx.compose.material.icons.rounded.PhoneAndroid
import androidx.compose.material.icons.rounded.PlayArrow
import androidx.compose.material.icons.rounded.Settings
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

private val Ink = Color(0xFFF8FAFC)
private val Muted = Color(0xFFA6AFBD)
private val MutedStrong = Color(0xFFCAD1DC)
private val Background = Color(0xFF080B10)
private val Panel = Color(0xFF111722)
private val Field = Color(0xFF0B0F14)
private val Line = Color(0xFF2B3544)
private val Accent = Color(0xFFFF6A00)
private val AccentSoft = Color(0x33FF6A00)
private val Success = Color(0xFF22C55E)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            BitMoboMediaApp()
        }
    }
}

@Composable
private fun BitMoboMediaApp() {
    MaterialTheme {
        Surface(color = Background, contentColor = Ink) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        Brush.verticalGradient(
                            listOf(Color(0xFF351504), Background, Color(0xFF0C1119))
                        )
                    )
            ) {
                MediaStudioScreen()
            }
        }
    }
}

@Composable
private fun MediaStudioScreen() {
    var sourceMode by remember { mutableStateOf(SourceMode.Url) }
    var url by remember { mutableStateOf("") }
    var format by remember { mutableStateOf("mp3") }
    var quality by remember { mutableStateOf("192 kbps") }
    var status by remember { mutableStateOf("Base Android pronta. O motor local entra na próxima etapa.") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .statusBarsPadding()
            .navigationBarsPadding()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 18.dp, vertical = 18.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Header()

        PanelCard {
            SectionTitle(
                title = "Converter mídia",
                subtitle = "Fluxo mobile preparado para análise, conversão e download local."
            )

            SegmentedControl(
                selected = sourceMode,
                onSelected = {
                    sourceMode = it
                    status = if (it == SourceMode.Url) {
                        "Modo URL selecionado."
                    } else {
                        "Modo arquivo local preparado para a etapa de permissões."
                    }
                }
            )

            if (sourceMode == SourceMode.Url) {
                OutlinedTextField(
                    value = url,
                    onValueChange = { url = it },
                    modifier = Modifier.fillMaxWidth(),
                    label = { Text("URL do vídeo") },
                    leadingIcon = { Icon(Icons.Rounded.Link, contentDescription = null) },
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Uri),
                    colors = fieldColors()
                )
            } else {
                FileDropPreview()
            }

            OptionGroup(
                title = "Formato",
                options = listOf("mp3", "m4a", "opus", "flac"),
                selected = format,
                onSelected = {
                    format = it
                    if (it == "flac") quality = "sem perdas"
                }
            )

            OptionGroup(
                title = "Qualidade",
                options = if (format == "flac") listOf("sem perdas") else listOf("128 kbps", "192 kbps", "256 kbps", "320 kbps"),
                selected = quality,
                onSelected = { quality = it }
            )

            StatusBanner(status)

            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Button(
                    onClick = {
                        status = if (sourceMode == SourceMode.Url && url.isBlank()) {
                            "Informe uma URL para continuar."
                        } else {
                            "UI pronta. Na próxima parte conectaremos o yt-dlp local."
                        }
                    },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Accent, contentColor = Color.White)
                ) {
                    Icon(Icons.Rounded.PlayArrow, contentDescription = null)
                    Spacer(Modifier.width(8.dp))
                    Text("Preparar", fontWeight = FontWeight.Black)
                }

                OutlinedButton(
                    onClick = { status = "Configurações entram depois do motor local." },
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = Ink),
                    border = BorderStroke(1.dp, Line)
                ) {
                    Icon(Icons.Rounded.Settings, contentDescription = null)
                }
            }
        }

        PanelCard {
            SectionTitle(
                title = "Motor local",
                subtitle = "Arquitetura sem Render e sem PC ligado."
            )
            CapabilityRow(Icons.Rounded.PhoneAndroid, "Execução no celular", "Base criada")
            CapabilityRow(Icons.Rounded.Download, "Download por yt-dlp", "Próxima parte")
            CapabilityRow(Icons.Rounded.AudioFile, "Conversão com FFmpeg", "Próxima parte")
            CapabilityRow(Icons.Rounded.Bolt, "APK via GitHub Actions", "Configurado")
        }
    }
}

@Composable
private fun Header() {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Image(
            painter = painterResource(R.drawable.bitmobo_mark),
            contentDescription = null,
            modifier = Modifier
                .size(54.dp)
                .clip(RoundedCornerShape(10.dp))
        )
        Spacer(Modifier.width(12.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = "BITMOBO LABS",
                color = Accent,
                fontSize = 11.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = 1.2.sp
            )
            Text(
                text = "Media Studio",
                color = Ink,
                fontSize = 28.sp,
                fontWeight = FontWeight.Black,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
            Text(
                text = "Conversão mobile com motor local.",
                color = Muted,
                fontSize = 14.sp,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}

@Composable
private fun PanelCard(content: @Composable ColumnScope.() -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(10.dp))
            .background(Panel.copy(alpha = 0.96f))
            .border(1.dp, Line, RoundedCornerShape(10.dp))
            .padding(18.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        content = content
    )
}

@Composable
private fun SectionTitle(title: String, subtitle: String) {
    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
        Text(title, color = Ink, fontSize = 20.sp, fontWeight = FontWeight.Black)
        Text(subtitle, color = Muted, fontSize = 13.sp)
    }
}

@Composable
private fun SegmentedControl(selected: SourceMode, onSelected: (SourceMode) -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(10.dp))
            .background(Field)
            .border(1.dp, Line, RoundedCornerShape(10.dp))
            .padding(4.dp),
        horizontalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        SegmentButton("Via URL", SourceMode.Url, selected, onSelected, Modifier.weight(1f))
        SegmentButton("Arquivo", SourceMode.File, selected, onSelected, Modifier.weight(1f))
    }
}

@Composable
private fun SegmentButton(
    label: String,
    mode: SourceMode,
    selected: SourceMode,
    onSelected: (SourceMode) -> Unit,
    modifier: Modifier = Modifier
) {
    val active = selected == mode
    Box(
        modifier = modifier
            .height(46.dp)
            .clip(RoundedCornerShape(8.dp))
            .background(if (active) Accent else Color.Transparent)
            .clickable { onSelected(mode) },
        contentAlignment = Alignment.Center
    ) {
        Text(
            label,
            color = if (active) Color.White else MutedStrong,
            fontWeight = FontWeight.Black
        )
    }
}

@Composable
private fun FileDropPreview() {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(10.dp))
            .background(Field)
            .border(1.dp, Line, RoundedCornerShape(10.dp))
            .padding(14.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(Icons.Rounded.AudioFile, contentDescription = null, tint = Accent)
        Spacer(Modifier.width(10.dp))
        Column {
            Text("Selecionar arquivo local", color = Ink, fontWeight = FontWeight.Black)
            Text("Permissões e seletor entram na etapa de arquivos.", color = Muted, fontSize = 13.sp)
        }
    }
}

@Composable
@OptIn(ExperimentalLayoutApi::class)
private fun OptionGroup(
    title: String,
    options: List<String>,
    selected: String,
    onSelected: (String) -> Unit
) {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text(title, color = Ink, fontSize = 13.sp, fontWeight = FontWeight.Black)
        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            options.forEach { option ->
                OptionChip(
                    label = option,
                    selected = option == selected,
                    onClick = { onSelected(option) }
                )
            }
        }
    }
}

@Composable
private fun OptionChip(label: String, selected: Boolean, onClick: () -> Unit) {
    Box(
        modifier = Modifier
            .clip(CircleShape)
            .background(if (selected) AccentSoft else Field)
            .border(1.dp, if (selected) Accent else Line, CircleShape)
            .clickable(onClick = onClick)
            .padding(horizontal = 14.dp, vertical = 9.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            label,
            color = if (selected) Color.White else MutedStrong,
            fontWeight = FontWeight.Bold,
            fontSize = 13.sp
        )
    }
}

@Composable
private fun StatusBanner(text: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .background(Color(0xFF12261A))
            .border(1.dp, Success.copy(alpha = 0.34f), RoundedCornerShape(8.dp))
            .padding(12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(Icons.Rounded.CheckCircle, contentDescription = null, tint = Success)
        Spacer(Modifier.width(10.dp))
        Text(text, color = Color(0xFFDCFCE7), fontSize = 13.sp)
    }
}

@Composable
private fun CapabilityRow(icon: ImageVector, label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(38.dp)
                .clip(RoundedCornerShape(8.dp))
                .background(Field),
            contentAlignment = Alignment.Center
        ) {
            Icon(icon, contentDescription = null, tint = Accent)
        }
        Spacer(Modifier.width(12.dp))
        Text(label, modifier = Modifier.weight(1f), color = MutedStrong, fontWeight = FontWeight.Bold)
        Text(value, color = Ink, fontWeight = FontWeight.Black, fontSize = 13.sp)
    }
}

@Composable
private fun fieldColors() = OutlinedTextFieldDefaults.colors(
    focusedContainerColor = Field,
    unfocusedContainerColor = Field,
    focusedBorderColor = Accent,
    unfocusedBorderColor = Line,
    focusedLabelColor = Accent,
    unfocusedLabelColor = Muted,
    focusedLeadingIconColor = Accent,
    unfocusedLeadingIconColor = Muted,
    cursorColor = Accent,
    focusedTextColor = Ink,
    unfocusedTextColor = Ink
)

private enum class SourceMode {
    Url,
    File
}
