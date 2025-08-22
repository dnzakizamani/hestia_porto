<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ArtworkResource\Pages;
use App\Models\Artwork;
use Filament\Forms;
use Filament\Tables;
use Filament\Resources\Resource;
use Filament\Forms\Components\FileUpload;

class ArtworkResource extends Resource
{
    protected static ?string $model = Artwork::class;

    protected static ?string $navigationIcon = 'heroicon-o-photo';
    protected static ?string $navigationLabel = 'Artworks';
    protected static ?string $slug = 'artworks';

    public static function form(Forms\Form $form): Forms\Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('title')
                ->required()
                ->maxLength(255),

            FileUpload::make('image_path')
                ->image()
                ->directory('projects/artworks')
                ->required(),

            Forms\Components\Select::make('project_id')
                ->relationship('project', 'title')
                ->required(),
        ]);
    }

    public static function table(Tables\Table $table): Tables\Table
    {
        return $table->columns([
            Tables\Columns\TextColumn::make('id')->sortable(),
            Tables\Columns\TextColumn::make('title')->searchable(),
            Tables\Columns\TextColumn::make('project.title')->label('Project'),
            Tables\Columns\ImageColumn::make('image_path')->square(),
        ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListArtworks::route('/'),
            'create' => Pages\CreateArtwork::route('/create'),
            'edit' => Pages\EditArtwork::route('/{record}/edit'),
        ];
    }
}
