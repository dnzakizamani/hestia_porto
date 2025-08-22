<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProjectResource\Pages;
use App\Models\Project;
use App\Models\Category;
use Filament\Forms;
use Filament\Tables;
use Filament\Resources\Resource;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Illuminate\Support\Facades\Auth;


class ProjectResource extends Resource
{
    protected static ?string $model = Project::class;

    protected static ?string $navigationIcon = 'heroicon-o-briefcase';
    protected static ?string $navigationLabel = 'Projects';
    protected static ?string $slug = 'projects';

    public static function form(Forms\Form $form): Forms\Form
    {
        return $form->schema([
            Forms\Components\Hidden::make('artist_id')
                ->default(fn () => Auth::user()->id),

            Forms\Components\TextInput::make('title')
                ->required()
                ->maxLength(255),

            Forms\Components\Textarea::make('description')
                ->rows(4),

            Forms\Components\Select::make('category_id')
                ->relationship('category', 'name')
                ->searchable()
                ->required(),

            // Forms\Components\DatePicker::make('published_at')
            //     ->label('Published Date'),

            // Upload cover utama
            Forms\Components\FileUpload::make('cover_image')
                ->disk('public') // 🔑 penting
                ->directory('projects/covers')
                ->image()
                ->required(),


            // Upload multiple artworks langsung (opsional)
                Forms\Components\Repeater::make('artworks')
                ->relationship()
                ->schema([
                    Forms\Components\TextInput::make('title')->required(),
                    Forms\Components\FileUpload::make('image_path')
                        ->disk('public') // 🔑 juga penting
                        ->directory('projects/artworks')
                        ->image(),
                ])
                ->collapsible()
                ->defaultItems(1)
                ->label('Artworks'),
        ]);
    }

    public static function table(Tables\Table $table): Tables\Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->sortable(),

                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('category.name')
                    ->label('Category')
                    ->sortable(),

                Tables\Columns\ImageColumn::make('cover_image')
                    ->disk('public')
                    ->square(),
                

                // Tables\Columns\TextColumn::make('published_at')
                //     ->date()
                //     ->sortable(),
            ])
            ->filters([
                // Filter by Category
                Tables\Filters\SelectFilter::make('category_id')
                    ->relationship('category', 'name')
                    ->label('Category'),

                // Filter published vs draft
                Tables\Filters\TernaryFilter::make('published_at')
                    ->label('Published')
                    ->nullable()
                    ->trueLabel('Published')
                    ->falseLabel('Unpublished')
                    ->queries(
                        true: fn ($query) => $query->whereNotNull('published_at'),
                        false: fn ($query) => $query->whereNull('published_at'),
                    ),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
            ]);
    }


    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProjects::route('/'),
            'create' => Pages\CreateProject::route('/create'),
            'edit' => Pages\EditProject::route('/{record}/edit'),
        ];
    }
}
