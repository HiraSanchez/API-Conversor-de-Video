# BitMobo Media Studio Android

Aplicativo Android nativo para a versao mobile do BitMobo Media Studio.

Esta pasta foi criada para permitir APK instalavel sem depender do Render nem do PC ligado para processar midia no futuro.

## Stack

- Kotlin
- Jetpack Compose
- Android Gradle Plugin
- Build automatizado via GitHub Actions

## Como gerar APK sem Android Studio

1. Envie o projeto para o GitHub.
2. Abra a aba **Actions** do repositorio.
3. Rode o workflow **Android APK**.
4. Baixe o artefato `bitmobo-media-studio-debug-apk`.
5. Instale o APK no celular Android.

## Status

Parte atual:

- Base Android criada.
- UI inicial com identidade BitMobo.
- Workflow de build do APK configurado.

Proximas partes:

- Integrar analise por `yt-dlp`.
- Integrar download/conversao local.
- Salvar arquivos no aparelho.
