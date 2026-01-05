# Sugerencias para el Juego de Ordenar Frases

## Audio vs Video: Recomendaciones

### ✅ **Recomendación: Usar AUDIO**

**Ventajas del Audio:**
- **Más ligero**: Los archivos de audio ocupan mucho menos espacio
- **Fácil de transcribir**: Puedes usar herramientas de transcripción automática o hacerlo manualmente
- **Enfoque en el contenido**: Los niños se concentran mejor en escuchar y entender
- **Más rápido de cargar**: Mejor experiencia para usuarios con conexión lenta
- **Flexible**: Fácil de editar y reemplazar

**Herramientas para extraer texto de audio:**
1. **Manual**: Escucha y escribe la frase
2. **Whisper AI** (OpenAI): Transcribir audio a texto automáticamente
3. **Google Speech-to-Text**: API de Google para transcripciones
4. **Otter.ai**: Servicio online de transcripción

### Video (Opcional)

Si prefieres usar video:
- Puedes usar videos cortos (máximo 30-60 segundos)
- El sistema soporta ambos formatos
- Recomendado solo si el video aporta valor visual

## Estructura de Datos

Para agregar nuevas frases, edita `data/mockPhrases.ts`:

```typescript
{
  id: 'phrase-X',
  title: 'Título de la frase',
  phrase: 'Texto completo de la frase que debe ordenarse',
  audioUrl: '/audios/frases/nombre-archivo.mp3', // O ruta absoluta
  category: 'Educación Financiera', // O 'Refranes', etc.
  difficulty: 'facil' | 'medio' | 'dificil',
  hint: 'Pista opcional para ayudar al niño' // Opcional
}
```

## Formato de Audio Recomendado

- **Formato**: MP3 o WAV
- **Duración**: 5-30 segundos (frases cortas)
- **Calidad**: 128kbps o superior
- **Idioma**: Español claro y pausado (para niños)

## Funcionalidades Implementadas

✅ Reproducción de audio/video
✅ Text-to-Speech (dictado por voz)
✅ Ordenamiento de palabras (click)
✅ Validación de respuestas
✅ Sistema de puntos (10 puntos por frase correcta)
✅ Pistas opcionales
✅ Dificultades (fácil, medio, difícil)
✅ Persistencia en localStorage
✅ Diseño minimalista con colores sólidos

## Próximos Pasos

1. Agregar archivos de audio reales a la carpeta `public/audios/frases/`
2. Actualizar las URLs en `mockPhrases.ts`
3. Agregar más frases según sea necesario
4. (Opcional) Implementar drag & drop si prefieres ese método



